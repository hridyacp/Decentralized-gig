import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    // Celo Alfajores Testnet Configuration
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org", // Celo testnet RPC URL
      accounts: ["9b5c311faf691a41337907555b1f3acf472cded1b5b7b3d435ac0f5f044b674b"],
      chainId: 44787, // Celo Alfajores Chain ID
    },
    // You can also add Celo mainnet here later
    // celo: {
    //   url: "https://forno.celo.org",
    //   accounts: [privateKey],
    //   chainId: 42220,
    // }
  },
};

export default config;
