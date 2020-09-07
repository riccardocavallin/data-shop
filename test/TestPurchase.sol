pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Purchase.sol";

contract TestPurchase {
    // The address of the purchase contract to be tested
    Purchase purchase = Purchase(DeployedAddresses.Purchase());

    // The id of the data that will be used for testing
    uint expectedDataId = 8;

    // The expected owner of bought data is this contract
    address expectedBuyer = address(this);

    // Testing the buy() function
    function testUserCanBuyData() public {
        uint returnedId = purchase.buy(expectedDataId);
        Assert.equal(returnedId, expectedDataId, "Purchase of the expected data should match what is returned.");
    }

    // Testing retrieval of a single data's owner
    function testGetBuyerAddressByDataId() public {
        address buyer = purchase.buyers(expectedDataId);
        Assert.equal(buyer, expectedBuyer, "Owner of the expected data should be this contract");
    }

    // Testing retrieval of all data owners
    function testGetBuyerAddressByDataIdInArray() public {
        // Store buyers in memory rather than contract's storage
        address[100] memory buyers = purchase.getBuyers();
        Assert.equal(buyers[expectedDataId], expectedBuyer, "Owner of the expected data should be this contract");
    }

}