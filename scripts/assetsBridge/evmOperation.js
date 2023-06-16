const { time } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('ethers');
const EvmAssets_Artifact = require("../../artifacts/contracts/EvmAssets.sol/EvmAssets.json");
const evmAssets_address = "0x99c74584ef80af50DaDEc77cFc087f291c677272";

let privateKey = "0x315bdde188acc16b06b41b3ccb06da359c2bbb5a60072b61aa13f907aaaeb782";
let mechainHttpProvider = new ethers.providers.JsonRpcProvider(
    "http://8.217.116.59:9933"
);

const mechainSigner = new ethers.Wallet(privateKey, mechainHttpProvider);
let EvmAssets = new ethers.Contract(evmAssets_address, EvmAssets_Artifact.abi, mechainSigner);

let timeInt = 1000;
const assets = ["0x9B51233F5EFA233479d7afe1d5285B7926f99770", "0x06E59148e16F31A16d1ADDa939b6c60B9015e184", "0x11220C0cED373593741dcFc294B234Dfdc1f380D",
    "0x6C119a0e8eAacb481EEf5d30f965eDFB79b9De68", "0xEE6fa5d3109e512d9cA1C42A217F19658F637498", "0x0D70bb6A79DeaC5400615c16439c6658E5F7B0E5", "0x14B7965A27cB1778eEb47dbaF23B83A588623a31",
    "0x0d4e575a5F5C583B4979F7DE66b240B49fbe550e", "0xb6B9be761BB2f727433F90C3B7C0082E11cFBDe2"]

async function exec() {
    setInterval(async () => {
        try {
            let sender = await ethers.Wallet.createRandom().getAddress();
            let receiver = await ethers.Wallet.createRandom().getAddress();
            // let asset = await ethers.Wallet.createRandom().getAddress();
            let asset = assets[Math.floor((Math.random() * assets.length))]
            var random1 = Math.floor(Math.random() * 10) + 1;
            console.log("=============================================================\n");
            console.log(new Date())
            console.log("====sender:  " + sender);
            console.log("====receiver:  " + receiver);
            console.log("====asset:  " + asset);



            let amount = Math.floor(Math.random() * (100000 * random1)) + 12345;
            console.log("====amount:  " + amount);

            const overrides = {
                gasLimit: 15000000,
                gasPrice: 40 * 10 ** 9,
              };

            const sentTx = await EvmAssets.completeBridge(amount, asset, sender, receiver, overrides);
            
            console.log(`====Target chain transaction ID: ${sentTx.hash}`);
            // timeInt =Math.floor(Math.random()*(1000))+10000;
            // console.log(timeInt)
        } catch (e) {
            console.log("completeBridge exception", e);
        }
    }, Math.floor(Math.random() * (400)) + 1240)
}

async function deploy() {
    ///prepare deployer
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying contracts with the account:",
        await deployer.getAddress()
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());


    ///deploy AleoToken
    const EvmAssets = await ethers.getContractFactory("EvmAssets");
    const evmAssets = await EvmAssets.deploy(); //totalSupply = $10**12 * 10**6
    await evmAssets.deployed();
    console.log("evmAssets address:", evmAssets.address);
}

async function main() {
    await exec();
}


main().catch((exception) => {
    console.error("exception:" + exception);
    process.exitCode = 1;
});
