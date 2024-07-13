const hre = require("hardhat");

async function main() {
  console.log("Deploying MockUSDC to", hre.network.name);

  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();

  await mockUSDC.waitForDeployment();

  console.log("MockUSDC deployed to:", await mockUSDC.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
