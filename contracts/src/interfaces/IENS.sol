// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IENS {
    function owner(bytes32 node) external view returns (address);
    
    function resolver(bytes32 node) external view returns (address);
    
    function ttl(bytes32 node) external view returns (uint64);
}