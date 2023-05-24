const { ethers } = require('ethers');
const Token_Artifact = require("../../artifacts/contracts/Token.sol/AleoToken.json");
const AssetsBridge_Artifact = require("../../artifacts/contracts/AssetsBridge.sol/AssetsBridge.json");
const eth_bridge_address = "0xe22F3458eAC63Fc94FD4d26Dc76a033707218926";
const mechain_bridge_address = "0x6F6e50766d8D0A12DEAA6395f3F230C46726AbDC";
const token_address_eth = "0x6F6e50766d8D0A12DEAA6395f3F230C46726AbDC";
const token_address_mechain = "0xc349d0CC57d2DE98C52c79164Cdc26c03e2E7403";

const CrossChainSwap_Artifact = require("../../artifacts/contracts/CrossChainSwap.sol/CrossChainSwap.json");
const crossChainSwap_Address = "0xc349d0CC57d2DE98C52c79164Cdc26c03e2E7403";



let privateKey = "0x267762ab802631f2395fde004449c850cf5be841876a9042c0d2eea57b1922f0";
let ethHttpProvider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/3-VefB24BzwJ9dnkb9sKABundlDLZrRj"
);

let mechainHttpProvider = new ethers.providers.JsonRpcProvider(
    "http://8.217.116.59:9933"
);

const ethSigner = new ethers.Wallet(privateKey, ethHttpProvider);
const mechainSigner = new ethers.Wallet(privateKey, mechainHttpProvider);

///deposit
let ethAssetsBridge = new ethers.Contract(eth_bridge_address, AssetsBridge_Artifact.abi, ethSigner);
let mechainAssetsBridge = new ethers.Contract(mechain_bridge_address, AssetsBridge_Artifact.abi, mechainSigner);
let ethToken = new ethers.Contract(token_address_eth, Token_Artifact.abi, ethSigner);
let mechainToken = new ethers.Contract(token_address_mechain, Token_Artifact.abi, mechainSigner);
let CrossChainSwap = new ethers.Contract(crossChainSwap_Address, CrossChainSwap_Artifact.abi, mechainSigner);



mechainAssetsBridge.on('Deposit', async (sender, receiver, amount) => {
    console.log(`user${sender}deposit to ${receiver} amount=${amount}`);
    // Save on the swap mapping of mechain
    crossChainSwap.swap(mechainToken, ethToken, amount)

    // Call the ERC20 contract on the target chain and transfer the corresponding amount of ERC20 Token to the user
    const tx = await ethAssetsBridge.completeBridge(amount, token_address_eth, receiver);
    console.log(`Target chain transaction ID: ${tx.hash}`);
});


ethAssetsBridge.on('Deposit', async (sender, receiver, amount) => {
    console.log(`user${sender}deposit to ${receiver} amount=${amount}`);
    // Save on the swap mapping of mechain
    crossChainSwap.swap(ethToken, mechainToken, amount)

    // all the ERC20 contract on the target chain and transfer the corresponding amount of ERC20 Token to the user
    const tx = await mechainAssetsBridge.completeBridge(amount, token_address_mechain, receiver);
    console.log(`Target chain transaction ID: ${tx.hash}`);
});


console.log("test");
