// const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Bank', function () {
  it('Should be deployed', async function () {
    const Bank = await ethers.getContractFactory('Bank');
    const bank = await Bank.deploy();
    const deployed = await bank.deployed();
    console.log(deployed);
    // expect(deployed).to.equal(true);
  });
});
