const { BigNumber } = require("ethers")
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

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {

  let privateKey = "0x267762ab802631f2395fde004449c850cf5be841876a9042c0d2eea57b1922f0";
  let ethHttpProvider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/3-VefB24BzwJ9dnkb9sKABundlDLZrRj"
  );

  let mechainHttpProvider = new ethers.providers.JsonRpcProvider(
    "http://8.217.116.59:9933"
  );

  const ethSigner = new ethers.Wallet(privateKey, ethHttpProvider);
  const mechainSigner = new ethers.Wallet(privateKey, mechainHttpProvider);

  //contract
  let ethAssetsBridge = new ethers.Contract(eth_bridge_address, AssetsBridge_Artifact.abi, ethSigner);
  let mechainAssetsBridge = new ethers.Contract(mechain_bridge_address, AssetsBridge_Artifact.abi, mechainSigner);

  await ethAssetsBridge.transferOwnership("0xd59d14183997ebB6aC7B6E0939B60C4608682d76");
  console.log("await ethAssetsBridge.owner: " + await ethAssetsBridge.owner());
  await mechainAssetsBridge.transferOwnership("0xd59d14183997ebB6aC7B6E0939B60C4608682d76");
  console.log("await mechainAssetsBridge.owner: " + await mechainAssetsBridge.owner());

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
