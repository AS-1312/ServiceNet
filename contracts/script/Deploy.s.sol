// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {USDC} from "../src/mocks/USDC.sol";
import {ServiceNet} from "../src/ServiceNet.sol";
import {YellowSessionManager} from "../src/YellowSessionManager.sol";

contract DeployScript is Script {
    USDC public usdc;
    ServiceNet public serviceNet;
    YellowSessionManager public yellowSessionManager;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        
        usdc = new USDC();
        serviceNet = new ServiceNet(address(usdc), msg.sender);
        yellowSessionManager = new YellowSessionManager(address(serviceNet), address(usdc));

        vm.stopBroadcast();
    }
}
