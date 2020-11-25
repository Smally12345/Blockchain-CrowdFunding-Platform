pragma solidity ^0.6.6;
import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Voting{
    using SafeMath for uint256;
    bool public state;
    uint public yesCount;
    uint public noCount;
    bool[] public hasVoted;
    bool public result;
    uint public votingTime;
    constructor(uint len) public {
        state = false;
        yesCount = 0;
        noCount = 0;
        hasVoted = new bool[](len);
        votingTime = 0;
    }
    
    function getHasVoted() public view returns(bool[] memory HasVoted){
        HasVoted = hasVoted;
    }
    
    function RemainingTime() public view returns(uint VotingTime){
        if(now >= votingTime){
            VotingTime = 0;
        }
        else{
            VotingTime = votingTime - now;    
        }
    }
    
    function trigger() public {
        require(state == false);
        state = true;
        yesCount = 0;
        noCount = 0;
        votingTime = now.add(5 minutes);
        for(uint i = 0; i < hasVoted.length; i++){
            hasVoted[i] = false;    
        }
    }
    
    function vote(bool choice, uint idx) public {
        require(state == true);
        hasVoted[idx] = true;
        if(choice == true){
            yesCount = yesCount.add(1);
        }
        else{
            noCount = noCount.add(1);
        }
        uint majority = 0;
        if(hasVoted.length % 2 == 0){
            majority = hasVoted.length.div(2);
        }
        else{
            majority = hasVoted.length.add(1).div(2);
        }
        if(yesCount >= majority){
            state = false;
            result = true;
        }
        else if(noCount >= majority){
            state = false;
            result = false;
        }
    }
    
    function endVoting() public {
        require(now >= votingTime);
        require(state == true);
        state = false;
        result = true;
    }
    
    
}