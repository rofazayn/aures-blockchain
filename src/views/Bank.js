import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Tag,
  Text,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import bankContract from '../artifacts/contracts/Bank.sol/Bank.json';

const bankContractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

const Bank = () => {
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState(null);
  const [amount, setAmount] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState('');

  const getBalance = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined' && accountAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        bankContractAddress,
        bankContract.abi,
        provider
      );

      const balance = await contract.balanceOf(accountAddress);
      if (balance) {
        setAccountBalance(balance);
      }
    }
  }, [accountAddress]);

  const handleConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts.length > 0) {
        setAccountAddress(accounts[0]);
      }
    }
  };

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const credit = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        bankContractAddress,
        bankContract.abi,
        signer
      );
      const transaction = await tokenContract.credit(amount);
      await transaction.wait();
      await getBalance();
      console.log(`${amount} DZD successfully credited to ${accountAddress}`);
    }
  };

  const debit = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        bankContractAddress,
        bankContract.abi,
        signer
      );
      const transaction = await tokenContract.debit(amount);
      await transaction.wait();
      await getBalance();
      console.log(`${amount} DZD successfully debited from ${accountAddress}`);
    }
  };

  const transfer = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        bankContractAddress,
        bankContract.abi,
        signer
      );
      const transaction = await tokenContract.transfer(
        recipientAddress,
        transferAmount
      );
      await transaction.wait();
      await getBalance();
      console.log(
        `${transferAmount} DZD successfully sent to ${recipientAddress}`
      );
    }
  };

  return (
    <Container maxW={'container.sm'} py={20}>
      <Box py='4'>
        <Heading>Welcome to Aures Bank.</Heading>
        <Text textColor='gray.500'>Running on Aures Blockchain Beta.</Text>
      </Box>
      {accountAddress ? (
        <Box>
          <HStack alignItems={'center'}>
            <Tag colorScheme={'green'} p='2'>
              Account: {accountAddress}
            </Tag>
            <Button onClick={getBalance}>Refresh Balance</Button>
          </HStack>
          {accountBalance && (
            <Flex mt={4}>
              <Input
                isDisabled={true}
                value={`${accountBalance.toString()} DZD`}
                variant='filled'
              />
            </Flex>
          )}
          <Divider my='8' />
          <Box>
            <Heading size='md' mb='1'>
              Credit &amp; Debit from your Account
            </Heading>
            <Text color={'gray.500'} mb='3'>
              You can send money from your account to other accounts by filling
              the form down below.
            </Text>

            <Input
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              type='number'
              min={0}
              variant='filled'
              placeholder={'Enter the amount you wish to credit or debit.'}
              mb='3'
            />
            <HStack>
              <Button onClick={credit}>Credit Money</Button>
              <Button onClick={debit}>Debit Amount</Button>
            </HStack>
          </Box>

          <Divider my='8' />
          <Box>
            <Heading size='md' mb='1'>
              Send Money
            </Heading>
            <Text color={'gray.500'} mb='3'>
              You can send money from your account to other accounts by filling
              the form down below.
            </Text>
            <Input
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              type='text'
              variant='filled'
              placeholder={'Enter the recipient address here.'}
              mb='3'
            />
            <Input
              value={transferAmount}
              onChange={(e) => setTransferAmount(+e.target.value)}
              type='number'
              min={0}
              variant='filled'
              placeholder={'Enter the amount you wish to send.'}
              mb='3'
            />
            <Button onClick={transfer}>Transfer Money</Button>
          </Box>
        </Box>
      ) : (
        <Button onClick={handleConnect}>Connect to Your Bank Account</Button>
      )}
    </Container>
  );
};

export default Bank;
