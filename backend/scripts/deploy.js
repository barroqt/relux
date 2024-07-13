const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const network = hre.network.name;
  console.log("Deploying to network:", network);
  console.log("Using account:", (await hre.ethers.getSigners())[0].address);

  // Get the appropriate USDC address based on the network
  const USDC_ADDRESS = getUsdcAddress(network);
  console.log("Using USDC address:", USDC_ADDRESS);

  const ReluxMarketplace = await hre.ethers.getContractFactory(
    "ReluxMarketplace"
  );
  const reluxMarketplace = await ReluxMarketplace.deploy(USDC_ADDRESS);

  await reluxMarketplace.waitForDeployment();

  console.log(
    "ReluxMarketplace deployed to:",
    await reluxMarketplace.getAddress()
  );
  console.log(
    "Transaction hash:",
    reluxMarketplace.deploymentTransaction().hash
  );
}

function getUsdcAddress(network) {
  switch (network) {
    case "baseSepolia":
      return process.env.BASE_SEPOLIA_USDC_ADDRESS;
    case "zircuit":
      return process.env.ZIRCUIT_SEPOLIA_USDC_ADDRESS;
    case "scrollSepolia":
      return process.env.SCROLL_SEPOLIA_USDC_ADDRESS;
    case "arbitrumSepolia":
      return process.env.ARBITRUM_SEPOLIA_USDC_ADDRESS;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
