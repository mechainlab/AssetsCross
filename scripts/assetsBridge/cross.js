const { ethers } = require('ethers');
const Token_Artifact = require("../../artifacts/contracts/Token.sol/AleoToken.json");
const AssetsBridge_Artifact = require("../../artifacts/contracts/AssetsBridge.sol/AssetsBridge.json");
const eth_bridge_address = "0xe22F3458eAC63Fc94FD4d26Dc76a033707218926";
const mechain_bridge_address = "0x6F6e50766d8D0A12DEAA6395f3F230C46726AbDC";
const token_address_eth = "0x6F6e50766d8D0A12DEAA6395f3F230C46726AbDC";
const token_address_mechain = "0xc349d0CC57d2DE98C52c79164Cdc26c03e2E7403";

const overrides = {
    gasLimit: 15000000,
    gasPrice: 40 * 10 ** 9,
};

let privateKey = "0xddfd369b6b813914c36aa4f3db44e98e20a6497a0e884909910667a1f46652bc";
let ethHttpProvider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/3-VefB24BzwJ9dnkb9sKABundlDLZrRj"
);

let mechainHttpProvider = new ethers.providers.JsonRpcProvider(
    "http://8.217.116.59:9933"
);

const ethSigner = new ethers.Wallet(privateKey, ethHttpProvider);
const mechainSigner = new ethers.Wallet(privateKey, mechainHttpProvider);

let ethAssetsBridge = new ethers.Contract(eth_bridge_address, AssetsBridge_Artifact.abi, ethSigner);
let mechainAssetsBridge = new ethers.Contract(mechain_bridge_address, AssetsBridge_Artifact.abi, mechainSigner);
let ethToken = new ethers.Contract(token_address_eth, Token_Artifact.abi, ethSigner);
let mechainToken = new ethers.Contract(token_address_mechain, Token_Artifact.abi, mechainSigner);

async function main() {
    await mechainToken.approve(mechain_bridge_address, ethers.utils.parseUnits("10", 6), overrides);
    let deposit = await mechainAssetsBridge.deposit(
        ethers.utils.parseUnits("10", 6),
        token_address_mechain,
        mechainSigner.address,
        overrides
    );

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });