pragma solidity ^0.6.6;
import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Voting{
    using SafeMath for uint256;
    bool public state;
    uint public yesCount;
    uint public noCount;
    bool[] public hasVoted;
    bool public result;
    constructor(uint len) public {
        state = false;
        yesCount = 0;
        noCount = 0;
        hasVoted = new bool[](len);
    }
    
    function getHasVoted() public view returns(bool[] memory HasVoted){
        HasVoted = hasVoted;
    }
    
    function trigger() public {
        state = true;
        yesCount = 0;
        noCount = 0;
        for(uint i = 0; i < hasVoted.length; i++){
            hasVoted[i] = false;    
        }
    }
    
    function vote(bool choice, uint idx) public {
        hasVoted[idx] = true;
        if(choice == true){
            yesCount = yesCount.add(1);
        }
        else{
            noCount = noCount.add(1);
        }
        if(yesCount >= hasVoted.length.div(2)){
            state = false;
            result = true;
        }
        else if(noCount > hasVoted.length.div(2)){
            state = false;
            result = false;
        }
    }
    
    
}