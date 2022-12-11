const hre = require("hardhat");

async function main() {
    
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buymeacoffee = await BuyMeACoffee.deploy();
    await buymeacoffee.deployed();
    
    console.log(
      "contract deployed to: ", buymeacoffee.address
    );
 
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  