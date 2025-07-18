import { ethers } from "hardhat";

async function main() {
  
  const identityVerificationHubV2 = "0x68c931C9a534D37aa78094877F46fE46a49F1A51";
  
  const scope = 1183707188275697488527353236818649558174202727177876761685483585744305445010; 

  console.log("Deploying ExampleV2 contract with the following arguments:");
  console.log(`  IdentityVerificationHubV2: ${identityVerificationHubV2}`);
  console.log(`  Scope: ${scope}`);

  const ExampleV2Factory = await ethers.getContractFactory("ExampleV2");

  // Pass the arguments to the deploy function
  const exampleV2 = await ExampleV2Factory.deploy(
    identityVerificationHubV2,
    scope
  );

  await exampleV2.waitForDeployment();

  console.log(`✅ ExampleV2 contract deployed to: ${exampleV2.target}`);
  console.log("Waiting for block confirmations before verifying...");


  console.log("✅ Contract verified successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
