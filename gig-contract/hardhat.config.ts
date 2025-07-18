import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const SEPOLIA_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/R96FcJUcL7FTaGEDpdNng"; 
const PRIVATE_KEY = '0x3727e20937e6f8562fccdca4b077c18d6e37fc7209e4d827189558cd53d55d9b';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat", // The default network when you run `npx hardhat run`
  networks: {
    // 1. The local development network (runs on your machine)
    hardhat: {
      chainId: 31337,
    },
    // 2. The Sepolia test network (public)
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org", // Celo testnet RPC URL
      accounts: ["9b5c311faf691a41337907555b1f3acf472cded1b5b7b3d435ac0f5f044b674b"],
      chainId: 44787, // Celo Alfajores Chain ID
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY], // Your wallet's private key
      chainId: 11155111,
    },
  },
  etherscan: {
    // This is for verifying your contract on Etherscan after deployment
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
