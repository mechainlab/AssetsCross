use ethers::prelude::*;
use ethers::signers::Wallet;
use ethers::types::Address;
use rand::Rng;
use std::str::FromStr;
use std::thread;
use std::{error::Error, sync::Arc};
use tokio::time::Duration;

const EVM_ASSETS_ADDRESS: &str = "0xa2A09306e5dB113032719FE0112aFfEA5Ef2208a";
const PRIVATE_KEY: &str = "0x315bdde188acc16b06b41b3ccb06da359c2bbb5a60072b61aa13f907aaaeb782";
#[tokio::main]

async fn main() -> Result<(), Box<dyn Error>> {
    exec().await?;
    Ok(())
}

async fn exec() -> Result<(), Box<dyn Error>> {
    let provider = Provider::<Http>::try_from("http://8.217.116.59:9933")?;
    let wallet: LocalWallet = Wallet::from_str(PRIVATE_KEY)?;

    let mechain_signer = Arc::new(SignerMiddleware::new(
        provider,
        wallet.with_chain_id(9000 as u64),
    ));

    abigen!(EvmAssets, "./resource/abi/EvmAssets.json");

    let nft_assets = [
        "0xa210b31C70737AA2E09A0fFC151CF21e18365954".parse()?,
        "0x929df0684414f1327E982D33665EfD9635C90Da4".parse()?,
        "0xDBb30C2daDc8C2Fd207d61e464CF23A36e2eb1bE".parse()?,
        "0x122185c0BaBf48eA9a14317B3c46467b9607a195".parse()?,
        "0xF96e8Ead9fa2e5dEb44ea90fb6FED08A58B78DAE".parse()?,
        "0xD649312E29091de4f1F1E1c09E2502C08A2a0f6D".parse()?,
        "0x7340447a70cf4e75246Bd28A7F39E91513e6fA24".parse()?,
        "0xB22e158d808Fb0b6Dc182Fa7A8fb2b073F145B28".parse()?,
        "0xa1a7A1DbacA100f8f95CC02f13368D922bAB7675".parse()?,
        "0x0318Cc97300832a86624ed66c5f1d6A2316478Ed".parse()?,
    ];

    let evm_assets = EvmAssets::new(Address::from_str(EVM_ASSETS_ADDRESS)?, mechain_signer);

    loop {
        let sender = Address::random();
        let receiver = Address::random();
        let asset = nft_assets[rand::thread_rng().gen_range(0..nft_assets.len())];

        let token_id = rand::thread_rng().gen_range(1..10000);

        println!("=============================================================");
        println!("====sender:  {:?}", sender);
        println!("====receiver:  {:?}", receiver);
        println!("====asset:  {:?}", asset);

        let tx = evm_assets.complete_nft_bridge(token_id.into(), asset, sender, receiver);

        let receipt = tx.send().await;
        match receipt {
            Ok(sent_tx) => println!("====Target chain transaction ID: {:?}", sent_tx.tx_hash()),
            Err(e) => println!("completeBridge exception: {:?}", e),
        }
        thread::sleep(Duration::from_secs(8));
    }
}
