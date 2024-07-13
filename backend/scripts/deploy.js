const hre = require("hardhat");

async function main() {
  console.log("Deploying to network:", hre.network.name);
  console.log("Using account:", (await hre.ethers.getSigners())[0].address);

  const ReluxMarketplace = await hre.ethers.getContractFactory(
    "ReluxMarketplace"
  );
  const reluxMarketplace = await ReluxMarketplace.deploy();

  await reluxMarketplace.waitForDeployment();

  console.log(
    "ReluxMarketplace deployed to:",
    await reluxMarketplace.getAddress()
  );
  console.log(
    "Transaction hash:",
    reluxMarketplace.deploymentTransaction().hash
  );

  // Verify the deployment chain ID
  const deploymentChainId = await reluxMarketplace.deploymentChainId();
  console.log("Deployment Chain ID:", deploymentChainId.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
