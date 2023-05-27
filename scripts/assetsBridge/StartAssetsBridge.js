const { ethers } = require('ethers');
const Token_Artifact = require("../../artifacts/contracts/Token.sol/AleoToken.json");
const AssetsBridge_Artifact = require("../../artifacts/contracts/AssetsBridge.sol/AssetsBridge.json");
const eth_bridge_address = "0xe22F3458eAC63Fc94FD4d26Dc76a033707218926";
const mechain_bridge_address = "0x6F6e50766d8D0A12DEAA6395f3F230C46726AbDC";
const mumbai_bridge_address = "0x6F6e50766d8D0A12DEAA6395f3F230C46726AbDC";
const token_address_eth = "0x6F6e50766d8D0A12DEAA6395f3F230C46726AbDC";
const token_address_mechain = "0xc349d0CC57d2DE98C52c79164Cdc26c03e2E7403";
const token_address_mumbai = "0xc349d0CC57d2DE98C52c79164Cdc26c03e2E7403";

const CrossChainSwap_Artifact = require("../../artifacts/contracts/CrossChainSwap.sol/CrossChainSwap.json");
const crossChainSwap_Address = "0xc349d0CC57d2DE98C52c79164Cdc26c03e2E7403";

const TSS_Signer = require("./TSS_Signer");
const { resolveProperties } = require("@ethersproject/properties");
const { serialize } = require("@ethersproject/transactions");


let privateKey = "0x267762ab802631f2395fde004449c850cf5be841876a9042c0d2eea57b1922f0";
let ethHttpProvider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/3-VefB24BzwJ9dnkb9sKABundlDLZrRj"
);

let mechainHttpProvider = new ethers.providers.JsonRpcProvider(
    "http://8.217.116.59:9933"
);

let mumbaiHttpProvider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/YbE4U9U8b3M74_Un2wTDK83R0M2W1Ksf"
);

// const ethSigner = new ethers.Wallet(privateKey, ethHttpProvider);
const mechainSigner = new ethers.Wallet(privateKey, mechainHttpProvider);

///deposit
let ethAssetsBridge = new ethers.Contract(eth_bridge_address, AssetsBridge_Artifact.abi, ethHttpProvider);
let mechainAssetsBridge = new ethers.Contract(mechain_bridge_address, AssetsBridge_Artifact.abi, mechainHttpProvider);
let mumbaiAssetsBridge = new ethers.Contract(mumbai_bridge_address, AssetsBridge_Artifact.abi, mumbaiHttpProvider);
// let ethToken = new ethers.Contract(token_address_eth, Token_Artifact.abi, ethSigner);
// let mechainToken = new ethers.Contract(token_address_mechain, Token_Artifact.abi, mechainSigner);
// let CrossChainSwap = new ethers.Contract(crossChainSwap_Address, CrossChainSwap_Artifact.abi, mechainSigner);

// async function main() {

//     let tx = await mechainAssetsBridge.populateTransaction.completeBridge(100, token_address_eth, token_address_eth);
//     console.log(tx)
// }


// mechainAssetsBridge.on('Deposit', async (sender, receiver, amount) => {
//     console.log(`user${sender}deposit to ${receiver} amount=${amount}`);
//     // Save on the swap mapping of mechain
//     // crossChainSwap.swap(mechainToken, ethToken, amount)

//     let txData = await ethAssetsBridge.populateTransaction.completeBridge(amount, token_address_eth, receiver);
//     txData.chainId = 11155111; //Sepolia
//     txData.type = 2;
//     txData.maxPriorityFeePerGas = "0xf1013241"
//     txData.maxFeePerGas = "0xf1013241"
//     txData.gasLimit = "0x0927c0"
//     console.log("txData: " + txData)
//     const signature = await TSS_Signer.signTx(txData);
//     console.log("signature: " + signature)
//     const resolvedTx = await resolveProperties(txData);
//     const serializeTx = serialize(resolvedTx, signature);

//     const sentTx = await ethHttpProvider.sendTransaction(serializeTx);
//     console.log(`Target chain transaction ID: ${sentTx.hash}`);
// });



ethAssetsBridge.on('Deposit', async (sender, receiver, amount) => {
    console.log(`user${sender}deposit to ${receiver} amount=${amount}`);
    // Save on the swap mapping of mechain
    // crossChainSwap.swap(ethToken, mechainToken, amount)

    let txData = await mumbaiAssetsBridge.populateTransaction.completeBridge(amount, token_address_mumbai, receiver);
    txData.chainId = 80001; //Mumbai
    txData.from = "0xd59d14183997ebB6aC7B6E0939B60C4608682d76";
    txData.type = 2;
    txData.maxPriorityFeePerGas = "0xf1013241"
    txData.maxFeePerGas = "0xf1013241"
    txData.gasLimit = "0x0927c0"
    console.log("txData: " + txData)
    const signature = await TSS_Signer.signTx(txData);
    console.log("signature: " + signature)
    const resolvedTx = await resolveProperties(txData);
    const serializeTx = serialize(resolvedTx, signature);

    const sentTx = await mumbaiHttpProvider.sendTransaction(serializeTx);
    console.log(`Target chain transaction ID: ${sentTx.hash}`);});


mumbaiAssetsBridge.on('Deposit', async (sender, receiver, amount) => {
    console.log(`user${sender}deposit to ${receiver} amount=${amount}`);
    // Save on the swap mapping of mechain
    // crossChainSwap.swap(ethToken, mechainToken, amount)

    let txData = await ethAssetsBridge.populateTransaction.completeBridge(amount, token_address_eth, receiver);
    txData.chainId = 11155111; //Sepolia
    txData.from = "0xd59d14183997ebB6aC7B6E0939B60C4608682d76";
    txData.type = 2;
    txData.maxPriorityFeePerGas = "0xf1013241"
    txData.maxFeePerGas = "0xf1013241"
    txData.gasLimit = "0x0927c0"
    console.log("txData: " + txData)
    const signature = await TSS_Signer.signTx(txData);
    console.log("signature: " + signature)
    const resolvedTx = await resolveProperties(txData);
    const serializeTx = serialize(resolvedTx, signature);

    const sentTx = await ethHttpProvider.sendTransaction(serializeTx);
    console.log(`Target chain transaction ID: ${sentTx.hash}`);});


console.log("AssetsBridge Starting...");
console.log("AssetsBridge Start complete...");

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });