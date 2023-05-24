const { BigNumber } = require("ethers")

const overrides = {
  gasLimit: 15000000,
  gasPrice: 40 * 10 ** 9,
};

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {

  ///prepare deployer
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying contracts with the account:",
    await deployer.getAddress()
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());


  ///deploy AleoToken
  const AleoToken = await ethers.getContractFactory("AleoToken");
  const aleoToken = await AleoToken.deploy(BigNumber.from(10 ** 12).mul(BigNumber.from(10 ** 6))); //totalSupply = $10**12 * 10**6
  await aleoToken.deployed();
  console.log("aleoToken address:", aleoToken.address);

  ///deploy AleoToken
  const AssetsBridge = await ethers.getContractFactory("AssetsBridge");
  const assetsBridge = await AssetsBridge.deploy(); //totalSupply = $10**12 * 10**6
  await assetsBridge.deployed();
  console.log("assetsBridge address:", assetsBridge.address);

  await aleoToken.transfer(assetsBridge.address, BigNumber.from(6 ** 12).mul(BigNumber.from(10 ** 6)));

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
