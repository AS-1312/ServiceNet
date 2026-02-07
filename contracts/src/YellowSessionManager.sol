// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ServiceNet} from "./ServiceNet.sol";

/**
 * @title YellowSessionManager
 * @notice Manages Yellow Network sessions for ServiceNet
 */
contract YellowSessionManager is ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    ServiceNet public immutable SERVICE_NET;
    IERC20 public immutable USDC;
    
    mapping(bytes32 => Session) public sessions;
    mapping(address => bytes32[]) public userSessions;
    
    uint256 public sessionCount;
    
    struct Session {
        bytes32 sessionId;
        bytes32 serviceNode;
        address consumer;
        address provider;
        uint256 allowance;
        uint256 spent;
        uint256 callsMade;
        uint256 pricePerCall;
        uint64 openedAt;
        uint64 expiresAt;
        bool active;
    }
    
    event SessionOpened(
        bytes32 indexed sessionId,
        bytes32 indexed serviceNode,
        address indexed consumer,
        uint256 allowance
    );
    
    event SessionUsed(
        bytes32 indexed sessionId,
        uint256 calls,
        uint256 spent
    );
    
    event SessionClosed(
        bytes32 indexed sessionId,
        uint256 totalCalls,
        uint256 totalSpent,
        uint256 refunded
    );
    
    error SessionNotActive();
    error SessionExpired();
    error InsufficientAllowance();
    error Unauthorized();

    constructor(address _serviceNet, address _usdc) {
        SERVICE_NET = ServiceNet(_serviceNet);
        USDC = IERC20(_usdc);
    }
    
    /**
     * @notice Open a Yellow session
     * @param serviceNode Service to use
     * @param allowance USDC to deposit
     * @param duration Session duration in seconds
     */
    function openSession(
        bytes32 serviceNode,
        uint256 allowance,
        uint256 duration
    ) external nonReentrant returns (bytes32) {
        ServiceNet.Service memory service = SERVICE_NET.getService(serviceNode);
        require(service.active, "Service not active");
        
        bytes32 sessionId = keccak256(
            abi.encodePacked(msg.sender, serviceNode, block.timestamp, sessionCount++)
        );
        
        sessions[sessionId] = Session({
            sessionId: sessionId,
            serviceNode: serviceNode,
            consumer: msg.sender,
            provider: service.provider,
            allowance: allowance,
            spent: 0,
            callsMade: 0,
            pricePerCall: service.pricePerCall,
            openedAt: uint64(block.timestamp),
            expiresAt: uint64(block.timestamp + duration),
            active: true
        });
        
        userSessions[msg.sender].push(sessionId);
        USDC.safeTransferFrom(msg.sender, address(this), allowance);
        
        emit SessionOpened(sessionId, serviceNode, msg.sender, allowance);
        return sessionId;
    }
    
    /**
     * @notice Record usage in session (called by service backend)
     * @param sessionId Session ID
     * @param calls Number of calls made
     */
    function recordUsage(bytes32 sessionId, uint256 calls) external nonReentrant {
        Session storage session = sessions[sessionId];
        
        if (!session.active) revert SessionNotActive();
        if (block.timestamp > session.expiresAt) revert SessionExpired();
        
        uint256 cost = calls * session.pricePerCall;
        if (session.spent + cost > session.allowance) revert InsufficientAllowance();
        
        session.callsMade += calls;
        session.spent += cost;
        
        emit SessionUsed(sessionId, calls, cost);
    }
    
    /**
     * @notice Close session and settle payments
     * @param sessionId Session to close
     */
    function closeSession(bytes32 sessionId) external nonReentrant {
        Session storage session = sessions[sessionId];
        
        if (msg.sender != session.consumer && msg.sender != session.provider) {
            revert Unauthorized();
        }
        if (!session.active) revert SessionNotActive();
        
        session.active = false;
        
        uint256 totalSpent = session.spent;
        uint256 refund = session.allowance - totalSpent;
        
        uint256 fee = (totalSpent * 200) / 10000;
        uint256 providerAmount = totalSpent - fee;
        
        SERVICE_NET.recordUsage(session.serviceNode, session.consumer, session.callsMade);
        
        if (providerAmount > 0) {
            USDC.safeTransfer(session.provider, providerAmount);
        }
        if (fee > 0) {
            USDC.safeTransfer(SERVICE_NET.treasury(), fee);
        }
        if (refund > 0) {
            USDC.safeTransfer(session.consumer, refund);
        }
        
        emit SessionClosed(sessionId, session.callsMade, totalSpent, refund);
    }
    

    function getSession(bytes32 sessionId) public view returns (Session memory) {
        return sessions[sessionId];
    }
    
    function getUserSessions(address user) public view returns (bytes32[] memory) {
        return userSessions[user];
    }
    
    function isSessionActive(bytes32 sessionId) public view returns (bool) {
        Session memory session = sessions[sessionId];
        return session.active && block.timestamp <= session.expiresAt;
    }
    
    function getSessionBalance(bytes32 sessionId) public view returns (
        uint256 allowance,
        uint256 spent,
        uint256 remaining
    ) {
        Session memory s = sessions[sessionId];
        return (s.allowance, s.spent, s.allowance - s.spent);
    }
}