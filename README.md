# AI NFT Minter

This is an DApp where you can mint NFTs using AI. Using Hugging Face, a text is converted to an image and then minted as an NFT and uploaded to IPFS.
I followed this [Tutorial](https://www.youtube.com/watch?v=myascjqPnFc&list=PLbYKSVntn8fgfbv7ESi8tS7bHu-p3-AsN&index=22) for creating this project.

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)
- [NFT.Storage](https://nft.storage/) (Connection to IPFS)
- [Hugging Face](https://huggingface.co/) (AI Models)

## Setting Up
- 1. Clone the Repository

- 2. Install Dependencies:
`$ npm install`

- 3. Setup .env file:
Before running any scripts, you'll want to create a .env file with the values as seen in .env.example:

Create an account on [Hugging Face](https://huggingface.co/), visit your profile settings, and create a read access token. 

Create an account on [NFT.Storage](https://nft.storage/), and create a new API key.

- 4. Run tests
`$ npx hardhat test`

- 5. Start Hardhat node
`$ npx hardhat node`

- 6. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

- 7. Start frontend
`$ npm run start`