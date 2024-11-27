// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract EtherTransfer {
    event Transfer(address indexed from, address indexed to, uint amount, bool success);

    // Function to receive Ether and perform transfer
    function transferEther(address payable _to, uint _amount) public payable {
        // Check if the transaction is possible
        require(msg.value >= _amount, "Insufficient Ether sent.");

        // Perform the transfer
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether.");

        // Emit an event for successful transfer
        emit Transfer(msg.sender, _to, _amount, success);
    }

    // Fallback function to accept incoming Ether
    receive() external payable {
        emit Transfer(msg.sender, address(this), msg.value, true);
    }
}