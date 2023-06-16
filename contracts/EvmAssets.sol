// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EvmAssets {
    event CompleteEvmBridge(
        address indexed sender,
        address indexed receiver,
        address indexed asset,
        uint256 amount
    );

    event CompleteNFtEvmBridge(
        address indexed sender,
        address indexed receiver,
        address indexed asset,
        uint256 tokenId,
        uint256 assetType
    );

    function completeBridge(
        uint256 amount,
        address asset,
        address sender,
        address receiver
    ) external {
        //require(amount <= 100000000000000, "AssetsBridge: completeBridge more than max");
        //IERC20(asset).transfer(receiver, amount);
        emit CompleteEvmBridge(sender, receiver, asset, amount);
    }

    function completeNFTBridge(
        uint256 tokenId,
        address asset,
        address sender,
        address receiver
    ) external {
        //IERC721(asset).transfer(receiver, amount);
        emit CompleteNFtEvmBridge(sender, receiver, asset, tokenId, 1);
    }
}
