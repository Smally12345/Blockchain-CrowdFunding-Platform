pragma solidity ^0.6.6;
import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Project{
    using SafeMath for uint256;
    enum State {
        fundraising,
        fundsraised,
        complete,
        expired
    }
    
    event Fund(
        uint CurrentBalance,
        State state
    );
    
    event Checkpoint(
        uint paid,
        uint CompletedCheckpoints,
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
    uint public TotalCheckpoints;
    uint public CompletedCheckpoints;
    uint public paid;
    uint public toPay;
    constructor(string memory _title, string memory _desc, uint _goal, uint _deadline, address payable _creator, uint _totalCP) public {
        title = _title;
        desc = _desc;
        deadline = _deadline;
        goal = _goal;
        creator = _creator;
        currentbalance = 0;
        paid = 0;
        toPay = 0;
        CompletedCheckpoints = 0;
        TotalCheckpoints = _totalCP;
    }
    
    function getDetails() external view returns(address payable Creator, string memory ProjectTitle, string memory ProjectDesc, uint AmountGoal, uint Deadline, uint CurrentBal, State CurrentState, uint total_checkpoints, uint completed_checkpoints, uint Paid){
        Creator = creator;
        ProjectTitle = title;
        ProjectDesc = desc;
        Deadline = deadline;
        AmountGoal = goal;
        Creator = creator;
        CurrentBal = currentbalance;
        CurrentState = state;
        total_checkpoints = TotalCheckpoints;
        completed_checkpoints = CompletedCheckpoints;
        Paid = paid;
    }
    
    function contribute() external payable {
        require(msg.sender != creator);
        contributions[msg.sender] = contributions[msg.sender].add(msg.value);
        currentbalance = currentbalance.add(msg.value);
        if(currentbalance >= goal){
            toPay = currentbalance.div(TotalCheckpoints);
            completeCheckpoints();
            state = State.fundsraised;
        }
        emit Fund(
            currentbalance,
            state
        );
        
    }
    
    function payout(uint installment) private returns(bool){
        if(creator.send(installment)){
            paid = paid.add(installment);
            return true;
        }
        return false;
    }
    
    function completeCheckpoints() public{
        CompletedCheckpoints = CompletedCheckpoints.add(1);
        if(payout(toPay)){
           if(CompletedCheckpoints == TotalCheckpoints){
               state = State.complete;
           }
        }
        emit Checkpoint(
            paid,
            CompletedCheckpoints,
            state
        );
    }
}