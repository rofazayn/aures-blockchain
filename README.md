# Must have

- Geth - latest version.
- NodeJS - 12 LTS or above.

## The Directory

Create a new directory where you setup your blockchain

```shell
mkdir blockchain && cd blockchain
```

## Bootnode

The bootnode is the process responsible for linking nodes together, this process is responsible of identifying peers in the network.

### Start a bootnode

To start the bootnode use the following command:

```shell
bootnode -nodekey boot.key -nat "none:127.0.0.1" -addr ":30300"
```

### Example

The output should include an enode that looks similiar to this, this text will be used to connect nodes in the same network to each other:

    enode://1fef27cc534a194318d040b2dc3c9775a879c9fca1aa6ee75f00406c1cd09f2f1009450bfeea4102a7d0f97a90e0c13d7f93e0bdfc4da533f8eb789d08889728@127.0.0.1:0?discport=30300

## Setting up a node

### Account

In order to bootstrap a blockchain node we need an account.

#### Account Generation

Use this command to generate a new account, the datadir flag is used to specify the directory where the account is going to be stored.

```shell
geth account new --datadir "NODE_NAME"
```

You will be asked to enter a password, make sure you don't lose that password since it's going to be used to unlock the newly generated account later.

#### Example

The command will spit out an account address that looks similiar to this:

    0xf35Ea5Cd8E2302A07263A94BD9cbB239eeeC2c40

Make sure you store the password inside the node directory and call it password.txt that we could reference it later.

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

It should look like this, replace the arguments to the flags with your own.

```shell
geth --datadir node --networkid 38028 --bootnodes "enode://1fef27cc534a194318d040b2dc3c9775a879c9fca1aa6ee75f00406c1cd09f2f1009450bfeea4102a7d0f97a90e0c13d7f93e0bdfc4da533f8eb789d08889728@127.0.0.1:30300" --port 30301 --http --http.corsdomain "*" --http.port 8301 --allow-insecure-unlock --unlock 0xf35Ea5Cd8E2302A07263A94BD9cbB239eeeC2c40 --password "./node/password.txt" --mine
```

If everything goes well, then congratulations you have successfully setup a new blockchain network, you can add other members or peers to this chain by following the same steps before but make sure you use the same genesis block, networkId and enode address.
