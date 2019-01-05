# Blockchain tracker
Tracks Ether and Token transfers.

## Requirements
- [Node 8+](https://nodejs.org/en/)
- [Yarn (optional)](https://yarnpkg.com/en/)

## Setup

```
git clone git@github.com:dsemenovsky/blockchain-tracker-example.git
cd blockchain-tracker-example
yarn install
```

Fill .env from .env.example with the token contract address and replace abi.json file.

```
NODE_ENV=development

INFURA_URL=https://rinkeby.infura.io/{{you-private-api-key}}
INFURA_WS_URL=wss://rinkeby.infura.io/ws

ETH_BLOCK_TIME=30

TOKEN_CONTRACT_ADDRESS={{your-token-contract-address}}
```

## Running

Simply start the service and make a transfer from one wallet to another on Rindkeby testnet.

```
yarn start
```
