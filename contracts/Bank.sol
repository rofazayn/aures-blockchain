// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Bank {
    string public name = "Aures Bank";
    string public symbol = "DZD";
    uint256 public initialSupply = 1000000000;

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
