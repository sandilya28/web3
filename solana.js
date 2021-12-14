const web3 = require("@solana/web3.js");
const chalk = require("chalk");

const transferSOL = async (from, to, transferAmt) => {
  try {
    const connection = new web3.Connection(
      web3.clusterApiUrl("devnet"),
      "confirmed"
    );
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: new web3.PublicKey(from.publicKey.toString()),
        toPubkey: new web3.PublicKey(to.publicKey.toString()),
        lamports: transferAmt * web3.LAMPORTS_PER_SOL,
      })
    );

    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [from]
    );

    return signature;
  } catch (err) {
    console.error(err);
  }
};

const getWalletBalance = async (pubk) => {
  try {
    const connection = new web3.Connection(
      web3.clusterApiUrl("devnet"),
      "confirmed"
    );
    const balance = await connection.getBalance(new web3.PublicKey(pubk));

    return balance / web3.LAMPORTS_PER_SOL;
  } catch (err) {
    console.error(err);
  }
};

const airDropSol = async (publicKey, amount) => {
  try {
    const connection = new web3.Connection(
      web3.clusterApiUrl("devnet"),
      "confirmed"
    );

    console.log(`Airdropping ${amount}SOL`);
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * web3.LAMPORTS_PER_SOL
    );

    console.log(`Signature for the airdrop`, `${chalk.green`${signature}`}`);

    await connection.confirmTransaction(signature);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  transferSOL,
  getWalletBalance,
  airDropSol,
};
