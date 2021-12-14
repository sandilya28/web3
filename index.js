const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const web3 = require("@solana/web3.js");

const { getWalletBalance, transferSOL, airDropSol } = require("./solana");
const { getReturnAmount, totalAmtToBePaid, randomNumber } = require("./helper");

const gameExecution = async () => {
  const userSecretKey = [
    229, 65, 12, 110, 128, 101, 62, 119, 239, 95, 26, 67, 178, 99, 40, 77, 46,
    151, 163, 227, 167, 5, 138, 101, 140, 195, 212, 161, 105, 216, 79, 73, 6,
    85, 188, 71, 255, 12, 214, 102, 84, 170, 129, 127, 64, 57, 133, 22, 10, 9,
    135, 34, 75, 223, 107, 252, 253, 22, 242, 135, 180, 245, 221, 155,
  ];

  const userWallet = web3.Keypair.fromSecretKey(Uint8Array.from(userSecretKey));

  //Treasury
  const secretKey = [
    111, 188, 76, 169, 30, 105, 254, 33, 228, 66, 56, 215, 9, 37, 51, 188, 188,
    188, 20, 224, 228, 115, 17, 163, 151, 105, 113, 251, 105, 177, 28, 157, 125,
    202, 195, 203, 253, 137, 26, 209, 7, 2, 66, 193, 76, 241, 203, 168, 213, 5,
    226, 11, 142, 44, 125, 191, 167, 172, 166, 207, 176, 137, 210, 27,
  ];

  const treasuryWallet = web3.Keypair.fromSecretKey(Uint8Array.from(secretKey));

  console.log(
    chalk.green(
      figlet.textSync("SOL Stake", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );

  const generatedRandomNumber = randomNumber(1, 5);

  console.log(chalk.yellow(`The max bidding amount is 2.5 SOL here`));
  const answers = await inquirer.prompt([
    {
      name: "SOL",
      type: "number",
      message: "What is the amount of SOL do you want to stake?",
    },
    {
      name: "RATIO",
      type: "rawlist",
      message: "What is the ratio of your staking?",
      choices: ["1:1.25", "1:1.5", "1:1.75", "1:2"],
      filter: function (val) {
        return val.split(":")[1];
      },
    },
    {
      name: "GUESS",
      type: "number",
      message:
        "You need to guess a random number from 1 to 5 (both 1 and 5, included)",
      when: async (val) => {
        let investment = totalAmtToBePaid(val.SOL);
        if (investment > 5) {
          console.error(
            chalk.red`Stake limit exceeded. Stake with a smaller amount`
          );
          return false;
        }

        console.log(
          `You need to pay ${chalk.green`${investment}`} to move forward`
        );

        let balance = await getWalletBalance(userWallet.publicKey);
        if (investment > balance) {
          console.error(chalk.red`Insufficient balance`);
          return false;
        }

        console.log(
          chalk.green`You will get ${getReturnAmount(
            investment,
            val.RATIO
          )}, if your guess is right`
        );
        return true;
      },
    },
  ]);

  if (answers.GUESS == generatedRandomNumber) {
    await airDropSol(
      treasuryWallet.publicKey,
      getReturnAmount(answers.SOL, answers.RATIO)
    );
    const signature = await transferSOL(
      treasuryWallet,
      userWallet,
      getReturnAmount(answers.SOL, answers.RATIO)
    );

    console.log(chalk.green`Your guess is absolutely correct`);

    console.log("Here is the prize signature", chalk.green`${signature}`);
  } else {
    console.log(chalk.red`Better luck next time`);
  }
};

gameExecution();
