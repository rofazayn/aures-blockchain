# Blockchain & DApp Tutorial.

Let's create an Ethereum private network node, code a smart contract and deploy it to the network, then build a decentralized application that is powered with our network.

## Prerequisites

- JavaScript (Main programming language).
- Solidity (Ethereum programming language to write smart conracts).
- Shell (To run the commands).

## Requirements

- Geth - 1.10.15-stable or above.
- NodeJS - 12 LTS or above.

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

To start the bootnode use the following command:

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

As we can see we changed the output path of our compiled contracts to `./src/artifacts`, we will find the ABI (application binary interface) and the binary code of our compiled contracts.

## Coming Next: Building a Smart Contract
