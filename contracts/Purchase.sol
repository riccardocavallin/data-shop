pragma solidity ^0.5.0;

contract Purchase {

    address[100] public buyers;

    // Buying a data
    function buy(uint dataId) public returns (uint) {
        require(dataId >= 0 && dataId <= 100);
        buyers[dataId] = msg.sender;
        return dataId;
    }

    // Retrieving the buyers
    function getBuyers() public view returns (address[100] memory) {
        return buyers;
    }
}
