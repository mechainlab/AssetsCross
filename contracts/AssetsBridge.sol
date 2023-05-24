// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract AssetsBridge is Ownable{

   /*//////////////////////////////////////////////////////////////
                                 事件
   //////////////////////////////////////////////////////////////*/
   event WithdrawRewards(address indexed user, uint256 amount);

   event Deposit(address indexed sender, address indexed receiver, uint256 amount);
   event CompleteBridge(address indexed receiver, uint256 amount);

    /*//////////////////////////////////////////////////////////////
                                状态变量
    //////////////////////////////////////////////////////////////*/
    mapping(address => bool) public assets; // assets


    /*//////////////////////////////////////////////////////////////
                              存款/跨链逻辑
    //////////////////////////////////////////////////////////////*/
    function deposit(uint256 amount, address asset, address receiver) external {
        require(amount <= 100000000000000, "AssetsBridge: deposit more than max");
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, receiver, amount);

    }

    function completeBridge(uint256 amount, address asset, address receiver) external onlyOwner{
        require(amount <= 100000000000000, "AssetsBridge: completeBridge more than max");
        IERC20(asset).transfer(receiver, amount);
        emit CompleteBridge(receiver, amount);
    }

}
