// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// contract deployed to: 0x44ddbce30880ced7F8442Ccdc2E0eC73A31c93ee

contract BuyMeACoffee {
    event NewMemo( address indexed from,
         uint256 timestamp,
         string name,
         string message);

    struct Memo{
        address from;
         uint256 timestamp;
         string name;
         string message;
    }
    Memo[] memos;

    address payable owner;
    constructor(){
        owner = payable(msg.sender); 
    }

    function BuyCoffee(string memory _name, string memory _message) public payable{
        require(msg.value > 0, "can't buy coffee with 0 ETH");
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));
    
    emit NewMemo(
          msg.sender,
            block.timestamp,
            _name,
            _message);
    }

  function WithDrawTips() public{
               require(owner.send(address(this).balance));
            }

 function GetMemos() public view returns(Memo[] memory){
               return memos;
            }

    }

