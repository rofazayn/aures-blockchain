# Blockchain & DApp Tutorial.

Let's create an Ethereum private network node, code a smart contract and deploy it to the network, then build a decentralized application that is powered with our network.

## Prerequisites

- JavaScript (Main programming language).
- Solidity (Ethereum programming language to write smart conracts).
- Shell (To run the commands).

## Requirements

- Geth - 1.10.15-stable or above.
- NodeJS - 12 LTS or above.

## Reproducing

If you don't want to go through the full tutorial, just download or fork the repo and then run:

```shell
npm install
```

or

```shell
yarn
```

then skip the setting up the project, and jump into starting a node.

## The Directory

Create a new directory for the project.

```shell
mkdir aures-blockchain && cd aures-blockchain
```

Inside that directory create another directory for your blockchain.

```shell
mkdir blockchain
```

## The Bootnode

The bootnode is the process responsible for linking nodes together, this process is also responsible of identifying peers in as specific network.

### Start a bootnode

First change directory to your blockchain folder

```shell
cd blockchain
```

First we have to generate a key for our bootnode

```shell
bootnode -genkey boot.key
```

Then to start the bootnode use the following command:

```shell
bootnode -nodekey boot.key -nat "none:127.0.0.1" -addr ":30300"
```

#### Example

The output should include an enode that looks similiar to this, this text will be used to connect nodes in the same network to each other:

    enode://1fef27cc534a194318d040b2dc3c9775a879c9fca1aa6ee75f00406c1cd09f2f1009450bfeea4102a7d0f97a90e0c13d7f93e0bdfc4da533f8eb789d08889728@127.0.0.1:0?discport=30300

## Setting up a node

In order to bootstrap a blockchain node we need a crypto account.

### Account Generation

Use this command to generate a new account, the datadir flag is used to specify the directory where the account is going to be stored.

```shell
geth account new --datadir node
```

You will be asked to enter a password, make sure you don't lose that password since it's going to be used to unlock your newly generated account (example password: secret123)

#### Example

The command will spit out an account address that looks similiar to this:

    0xf35Ea5Cd8E2302A07263A94BD9cbB239eeeC2c40

Make sure you store the password in a text file inside the node directory and call it password.txt so that we can unlock the account using this file later when we try to start a miner node.

```shell
cd node && touch password.txt && echo secret123 > password.txt
```

## Genesis block

In order to start our node we first need to setup our genesis block

### Setting up the genesis block

We can use puppeth to generate a genesis block easily, note that Puppeth comes with Geth.

```shell
puppeth
```

Puppeth will prompt you with steps to setup your genesis block, make sure you follow them carefully.

We are going to build a PoA network, make sure you choose the Clique Consensus Engine. Also, for the accounts that are allowed to seal, enter the address of the account that we generated before. As for the accounts to be prefunded, use the address of your test account that you can get from a wallet like Metamask.

### Initializing account with genesis block

Use the newly generated genesis block to initialize your account that you created earlier, in my case my blockchain network name is "aures" so the genesis block JSON file will be called "aures.json"

```shell
geth init --datadir node aures.json
```

## Start the node

To start the node we can use the newly generated account, the bootnode address that we setup earlier and the genesis block that we setup:

The network id comes from the genesis block, open up the genesis block JSON file and look for the chainId property.

### Node starting command

It should look something like this, replace the arguments to the flags with your own args.

Also notice that the node we are about to start is a signer node (aka the miner node in PoA networks).

This node will be responsible for authorizing and sealing new blocks.

```shell
geth --datadir node --networkid 38028 --bootnodes "enode://1fef27cc534a194318d040b2dc3c9775a879c9fca1aa6ee75f00406c1cd09f2f1009450bfeea4102a7d0f97a90e0c13d7f93e0bdfc4da533f8eb789d08889728@127.0.0.1:30300" --port 30301 --http --http.corsdomain "*" --http.port 8301 --allow-insecure-unlock --unlock 0xf35Ea5Cd8E2302A07263A94BD9cbB239eeeC2c40 --password "./node/password.txt" --mine
```

If everything goes well, then congratulations you have successfully setup a new blockchain, you can add other nodes (members or peers) to this network by following the same steps mentioned before, but make sure you initiate them with the same genesis block, networkId and enode address.

_Note:_ If you want to start a non-miner node, then all you have to do is remove the `--mine` flag at the end of the node start command.

## The DApp

### Setting up React

To generate a new react application we are going to use the _create-react-app_ CLI.

Switch to the your parent folder `aures-blockchain` and run the following command

```shell
npx create-react-app .
```

or if you are using Yarn:

```shell
yarn create react-app .
```

### Setting up hardhat

Hardhat is an Ethereum development environment that will help us compile and tes our contracts before we deploy them to a specific network.

```shell
npm install --save-dev hardhat
```

or, if you are using yarn:

```shell
yarn add -D hardhat
```

then run the following command, you will be prompted _What do you want to do?_, you can choose _Create a sample project_ or another option if you are sure what you are doing.

For me I ll just go with a sample hardhat setup:

```shell
npx hardhat
```

After hardhat is initialized you can see that you have a few extra folders on your directory such as scripts and contracts

- contract: is a folder where all of our smart contracts files will be stored.
- scripts: is a folder where we can write scripts that we can later run.
- test: is a folder where we can write test scripts to test our contracts before deployment.

We can also see that we have a new file in our directory called `hardhat.config.js`, this is the configuration file of our hardhat environment, for now we only need to change one thing which is the exported object of our file.

```js
module.exports = {
  solidity: '0.8.4',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};
```

As we can see we changed the output path of our compiled contracts to `./src/artifacts`, we will find the ABI (application binary interface).

## Smart Contracts

To create a smart contract we have to write the code for it and compile it using a Solidity language compiler, then take the result of the compilation and deploy it to our blockchain.

### Create a Smart Contract

First we have to create a new file inside our contracts folder, for the sake of this tutorial, we'll be creating a bank smart contract, the contract will:

- Have accounts for different addresses.
- Each account has a balance.
- Account owners will be able to see the balance of their accounts.
- Account owners will be able to credit, debit and transfer money from their accounts if certain conditions are met.

So let's create our file and call it `Bank.sol`

```shell
cd ./contracts && touch Bank.sol
```

You can open up that file with your favourite code editor, then copy paste this code inside

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Bank {
    string public name = "Aures Bank";
    string public symbol = "DZD";
    uint256 public initialSupply = 10000000;

    mapping(address => uint256) balances;

    constructor() {
        balances[msg.sender] = initialSupply;
    }

    function debit(uint256 amount) external returns (uint256) {
        require(balances[msg.sender] >= amount, "Insufficient funds to debit.");
        balances[msg.sender] -= amount;
        return amount;
    }

    function credit(uint256 amount) external returns (uint256) {
        // require(balances[msg.sender] > amount, "Insufficient funds.");
        balances[msg.sender] += amount;
        return amount;
    }

    function transfer(address to, uint256 amount) external {
        require(
            balances[msg.sender] >= amount,
            "Insufficient funds to transfer."
        );
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
```

Before saving that file, we check if there are any errors in our contract code. If no errors were found, we can proceed to compiling it, to compile our contract we can run:

```shell
npx hardhat compile
```

If the compilation goes well we should see new files are generated inside our `src/artifacts` folder.

- A `build-info` folder, dont worry about it right now.
- A `contracts` folder: there we can find our compiled contracts.

If we open up our contracts folder from the artifacts, we see a new folder called `Bank.sol` folder, inside that folder we can find a file called `Bank.json` file, that is what we need in order to deploy our smart contract.

### Deploying our Contract to Hardhat Test Network

In order to do that we have to write a deployment scripts, open up the `scripts` folder, there we can find a JavaScript file, let's rename it to `deploy.js`

In there we remove the old code that deploys a greeting smart contract and replace it with our own deployment code that deploys our bank smart contracts, it should look something like this.

```js
const hre = require('hardhat');

async function main() {
  const Bank = await hre.ethers.getContractFactory('Bank');
  const bank = await Bank.deploy();
  await bank.deployed();

  console.log('Bank contract deployed to:', bank.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

The process is as follows:

- Create a async main function to benefit from asynchronous features.
- Get the contract factory (ABI and binary code) and deploy it to a a network.
- Wait for the address of the deployment contract if it is successfully deployed or catch errors if there are any.
- Exit with code 1.

If we recall, we scpeified a network field on our `hardhat.config.js` file.

```js
module.exports = {
  ...
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  ...
};
```

Hardhat network in this case is called localhost.

First we start Hardhat's test network, it will give us some pre-funded accounts to test with

```shell
npx hardhat node
```

We'll get something that looks like:

```shell
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

...
```

Then we run the deployment script against the test network.

```shell
npx hardhat run scripts/deploy.js --network localhost
```

_Make sure you pass the network flag and the `localhost` argument since we are not deploying directly to our newly created blockchain, but to hardhat test network first._

If everything goes well, we should get a success message and a deployment address:

```shell
Compiling 1 file with 0.8.4
Solidity compilation finished successfully
Bank contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Whoa! we have successfully deployed a contract to our test network, let's make sure we save that contract deployment address

    0x5FbDB2315678afecb367f032d93F642f64180aa3

### Deploying the Contract to our Blockchain

All we have to do is:

- Edit hardhat.config.json and add a new network configuration object.
- Get the private key of one of our prefunded accounts in order to use to pay for the contract deployment.

Inside hardhat.config.json we add

```js
  aures: {
      chainId: 38028,
      url: 'http://127.0.0.1:8301',
      accounts: [process.env.ACCOUNT_PK],
  },
```

Then we setup an environment variable containing our account's private key.

In the root directory we create `.env` file.

```shell
touch .env
```

Inside the `.env` file we paste our private key.

```env
ACCOUNT_PK=<private_key_here>
```

Save that file, make sure your newly created blockchain node is up and running then run the following command:

```shell
npx hardhat run scripts/deploy.js --network aures
```

Notice that I used `aures` as an argument to the network flag, in order to deploy it to this specific network.

After a block time, our terminal will return the deployed contract's address, we can copy that address now and connect it to ethers.js or web3 on our front-end app.

Example output:

```shell
Bank contract deployed to: 0x57Ad5f6D9E770B54235A1e0DB86D327656f85b8A
```

Go to `./src/components/Bank.js` and change the bankContractAddress variable to the address we received from the terminal.

```js
const bankContractAddress = '0x67CACc9265321403B24E9d18F1a6813d4fbce684';
```

### Running the dApp (React)

All we have to do now is run this command in the root directory of our project:

```shell
npm run start
```

or

```
yarn start
```

If you find errors, then make sure you install `Chakra UI` needed dependencies then try again.

If everything goes right, a browser window will show up with the app.

Connect your MetaMask account and make sure you are using the right network.

Go to MetaMask extension and click on Ethereum Mainnet button, then click on `Add Network`

There you add your blockchain:

```
  Network Name -> Aures Testnet
  New RPC URL -> http://127.0.0.1:8301
  Chain ID -> 38028
```

And that's it, you can now use the app, thank you for your time, I hope this tutorial was helpful to you in some way.
