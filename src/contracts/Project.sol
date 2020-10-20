pragma solidity ^0.6.6;
import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Project{
    using SafeMath for uint256;
    enum State {
        fundraising,
        complete,
        expired
    }
    
    event Fund(
        uint CurrentBalance,
        State state
    );
    string public title;
    string public desc;
    uint public goal;
    uint256 public deadline;
    uint256 public currentbalance;
    address payable public creator;
    State public state = State.fundraising;
    mapping(address => uint256) public contributions;
    constructor(string memory _title, string memory _desc, uint _goal, uint _deadline, address payable _creator) public {
        title = _title;
        desc = _desc;
        deadline = _deadline;
        goal = _goal;
        creator = _creator;
        currentbalance = 0;
    }
    
    function getDetails() external view returns(address payable Creator, string memory ProjectTitle, string memory ProjectDesc, uint AmountGoal, uint Deadline, uint CurrentBal, State CurrentState){
        Creator = creator;
        ProjectTitle = title;
        ProjectDesc = desc;
        Deadline = deadline;
        AmountGoal = goal;
        Creator = creator;
        CurrentBal = currentbalance;
        CurrentState = state;
    }
    
    function contribute() external payable {
        require(msg.sender != creator);
        contributions[msg.sender] = contributions[msg.sender].add(msg.value);
        currentbalance = currentbalance.add(msg.value);
        if(currentbalance >= goal){
            if(payout()){
                state = State.complete;
            }
        }
        emit Fund(
            currentbalance,
            state
        );
        
    }
    function payout() private returns(bool){
        if(creator.send(currentbalance)){
            return true;
        }
        return false;
    }
}