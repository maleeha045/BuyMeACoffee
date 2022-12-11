
const hre = require("hardhat");

async function GetBalance(address){
  const balance = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balance);
}

async function PrintBalances(addresses){
  let idx=0;
  for (const address of addresses){
console.log(`address ${idx} balance: `, await GetBalance(address));
idx++;
  }

}

async function PrintMemos(memos){
  for (const memo of memos){
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const address = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp} ${tipper} ${address} sends you a message: ${message}`);
  }
}



async function main() {
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buymeacoffee = await BuyMeACoffee.deploy();
  await buymeacoffee.deployed();
  console.log(
    "contract deployed to: ", buymeacoffee.address
  );
  const address1 = [owner.address, tipper.address, buymeacoffee.address];
  console.log("--before--");
  await PrintBalances(address1);

  const tip= {value: hre.ethers.utils.parseEther("1")};
 await buymeacoffee.connect(tipper).BuyCoffee("Maleeha", "Time is precious, use it wisely",tip);
 await buymeacoffee.connect(tipper2).BuyCoffee("Esha", "chase your dreams",tip);
 await buymeacoffee.connect(tipper3).BuyCoffee("Ayesha", "Don't forget to enjoy your life while chasing your Dreams",tip);



  console.log("--after--");
  await PrintBalances(address1);

  await buymeacoffee.connect(owner).WithDrawTips();
  
  console.log("--after withdraw--");
  await PrintBalances(address1);

  console.log("--memos--");
  const memos = await buymeacoffee.GetMemos();
 await PrintMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
