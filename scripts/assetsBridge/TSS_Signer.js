const { ethers } = require('ethers');
const axios = require("axios");
const { resolveProperties } = require("@ethersproject/properties");
const { serialize } = require("@ethersproject/transactions");
const { splitSignature, hexZeroPad } = require("@ethersproject/bytes");
const { keccak256 } = require("@ethersproject/keccak256");


exports.signTx = async function(txData) {
  const serializedTx = ethers.utils.serializeTransaction(txData);
  const signature = await axios.post(
    "http://localhost:8001/send-tx",
    keccak256(serializedTx).slice(2),
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );

  const parsedSigature = {
    recoveryParam: signature.data.recid,
    r: hexZeroPad(
      "0x" + Buffer.from(signature.data.r.scalar).toString("hex"),
      32
    ),
    s: hexZeroPad(
      "0x" + Buffer.from(signature.data.s.scalar).toString("hex"),
      32
    ),
  };

  return splitSignature(parsedSigature);
}