// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ServiceNet
 * @notice Simplified marketplace for ENS-based API services with Yellow Network
 */
contract ServiceNet is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    uint256 public constant PLATFORM_FEE = 200;    
    uint256 public minimumStake = 0.01 ether;
    
    address public treasury;
    
    IERC20 public immutable USDC;
    
    mapping(bytes32 => Service) public services;    
    mapping(address => bytes32[]) public providerServices;    
    mapping(bytes32 => Rating) public ratings;    
    mapping(bytes32 => mapping(address => bool)) public hasRated;
    mapping(address => uint256) public stakes;

    uint256 public totalServices;
    
    struct Service {
        address provider;
        string ensName;
        uint256 pricePerCall;
        uint256 totalCalls;
        uint256 totalRevenue;
        bool active;
        uint64 createdAt;
    }
    
    struct Rating {
        uint256 totalRatings;
        uint256 sumRatings;
        uint256 averageRating;
    }
    
    event ServiceRegistered(
        bytes32 indexed ensNode,
        address indexed provider,
        string ensName,
        uint256 pricePerCall
    );
    
    event ServiceUpdated(
        bytes32 indexed ensNode,
        uint256 newPrice
    );
    
    event UsageRecorded(
        bytes32 indexed ensNode,
        address indexed consumer,
        uint256 calls,
        uint256 amount
    );
    
    event RatingSubmitted(
        bytes32 indexed ensNode,
        address indexed user,
        uint8 stars
    );
    
    event RevenueWithdrawn(
        address indexed provider,
        uint256 amount
    );
    
    error ServiceNotFound();
    error ServiceNotActive();
    error InvalidPrice();
    error InsufficientStake();
    error Unauthorized();
    error AlreadyRated();
    error InvalidRating();
    

    constructor(address _usdc, address _treasury) Ownable(msg.sender) {
        USDC = IERC20(_usdc);
        treasury = _treasury;
    }
    
    /**
     * @notice Register a new service
     * @param ensNode ENS node hash (e.g., namehash("weather.api.eth"))
     * @param ensName Human-readable name
     * @param pricePerCall Price in USDC (6 decimals, e.g., 1000 = $0.001)
     */
    function registerService(
        bytes32 ensNode,
        string calldata ensName,
        uint256 pricePerCall
    ) external payable {
        if (pricePerCall == 0) revert InvalidPrice();
        if (msg.value < minimumStake) revert InsufficientStake();
        if (services[ensNode].provider != address(0)) revert ServiceNotFound();
        
        services[ensNode] = Service({
            provider: msg.sender,
            ensName: ensName,
            pricePerCall: pricePerCall,
            totalCalls: 0,
            totalRevenue: 0,
            active: true,
            createdAt: uint64(block.timestamp)
        });
        
        providerServices[msg.sender].push(ensNode);
        stakes[msg.sender] += msg.value;
        totalServices++;
        
        emit ServiceRegistered(ensNode, msg.sender, ensName, pricePerCall);
    }
    
    /**
     * @notice Update service price
     * @param ensNode Service to update
     * @param newPrice New price per call
     */
    function updatePrice(bytes32 ensNode, uint256 newPrice) external {
        Service storage service = services[ensNode];
        if (service.provider != msg.sender) revert Unauthorized();
        if (newPrice == 0) revert InvalidPrice();
        
        service.pricePerCall = newPrice;
        emit ServiceUpdated(ensNode, newPrice);
    }
    
    /**
     * @notice Toggle service active status
     * @param ensNode Service to toggle
     */
    function toggleService(bytes32 ensNode) external {
        Service storage service = services[ensNode];
        if (service.provider != msg.sender) revert Unauthorized();
        
        service.active = !service.active;
    }

    /**
     * @notice Record service usage and process payment
     * @dev Called after API calls are made (by backend or oracle)
     * @param ensNode Service used
     * @param consumer Who used the service
     * @param calls Number of calls made
     */
    function recordUsage(
        bytes32 ensNode,
        address consumer,
        uint256 calls
    ) external nonReentrant {
        Service storage service = services[ensNode];
        if (!service.active) revert ServiceNotActive();
        
        uint256 totalAmount = calls * service.pricePerCall;
        uint256 fee = (totalAmount * PLATFORM_FEE) / 10000;
        uint256 providerAmount = totalAmount - fee;
        
        service.totalCalls += calls;
        service.totalRevenue += totalAmount;
        
        USDC.safeTransferFrom(consumer, service.provider, providerAmount);
        USDC.safeTransferFrom(consumer, treasury, fee);
        
        emit UsageRecorded(ensNode, consumer, calls, totalAmount);
    }
    
    /**
     * @notice Submit a rating for a service
     * @param ensNode Service to rate
     * @param stars Rating from 1-5
     */
    function submitRating(bytes32 ensNode, uint8 stars) external {
        if (stars < 1 || stars > 5) revert InvalidRating();
        if (hasRated[ensNode][msg.sender]) revert AlreadyRated();
        if (services[ensNode].provider == address(0)) revert ServiceNotFound();
        
        Rating storage rating = ratings[ensNode];
        rating.totalRatings++;
        rating.sumRatings += stars;
        rating.averageRating = (rating.sumRatings * 100) / rating.totalRatings;
        
        hasRated[ensNode][msg.sender] = true;
        
        emit RatingSubmitted(ensNode, msg.sender, stars);
    }


    function getService(bytes32 ensNode) public view returns (Service memory) {
        return services[ensNode];
    }
    
    function getProviderServices(address provider) public view returns (bytes32[] memory) {
        return providerServices[provider];
    }
    
    function getRating(bytes32 ensNode) public view returns (
        uint256 totalRatings,
        uint256 averageRating
    ) {
        Rating memory r = ratings[ensNode];
        return (r.totalRatings, r.averageRating);
    }
    
    function getServiceMetrics(bytes32 ensNode) public view returns (
        uint256 totalCalls,
        uint256 totalRevenue,
        uint256 avgRating
    ) {
        Service memory s = services[ensNode];
        Rating memory r = ratings[ensNode];
        return (s.totalCalls, s.totalRevenue, r.averageRating);
    }
    
    
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }
    
    function setMinimumStake(uint256 _minimum) external onlyOwner {
        minimumStake = _minimum;
    }
}