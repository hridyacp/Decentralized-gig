import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  const GigMarketplace = await ethers.getContractFactory("GigMarketplace");


  console.log("Deploying GigMarketplace contract...");

  
  const gigMarketplace = await GigMarketplace.deploy();

 // await gigMarketplace.deployed();
await gigMarketplace.waitForDeployment();
  console.log(`GigMarketplace contract deployed to: ${gigMarketplace.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});