pragma solidity ^0.6.6;
import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';
import './Voting.sol';
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
        State state,
        address[] backers
    );
    
    event Checkpoint(
        uint paid,
        uint CompletedCheckpoints,
        State state
    );
    
    event Trigger(
        bool votingState
    );
    
    event VoteEvent(
        bool votingState,
        bool[] HasVoted,
        bool result
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
    address[] public backers;
    Voting public voting;
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
        voting = new Voting(0);
    }
    
    function getDetails() external view returns(address payable Creator, string memory ProjectTitle, string memory ProjectDesc, uint AmountGoal, uint Deadline, uint CurrentBal, State CurrentState, uint total_checkpoints, uint completed_checkpoints, uint Paid, address[] memory Backers){
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
        Backers = backers;
    }
    function getVoteDetails() external view returns(bool votingState, bool[] memory HasVoted, bool result){
        votingState = voting.state();
        HasVoted = voting.getHasVoted();
        result = voting.result();
    }
    
    function contribute() external payable {
        require(msg.sender != creator);
        contributions[msg.sender] = contributions[msg.sender].add(msg.value);
        currentbalance = currentbalance.add(msg.value);
        backers.push(msg.sender);
        if(currentbalance >= goal){
            toPay = currentbalance.div(TotalCheckpoints);
            completeCheckpoints();
            state = State.fundsraised;
        }
        emit Fund(
            currentbalance,
            state,
            backers
            
        );
        
    }
    
    function payout(uint installment) private returns(bool){
        if(creator.send(installment)){
            paid = paid.add(installment);
            return true;
        }
        return false;
    }
    
    function completeCheckpoints() public {
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
    
    function triggerVoting() public {
        voting = new Voting(backers.length);
        voting.trigger();
        bool votingState = voting.state();
        emit Trigger(
            votingState
        );
    }
    
    function Vote(bool choice, uint idx) public {
        voting.vote(choice, idx);
        bool result = voting.result();
        bool[] memory HasVoted = voting.getHasVoted();
        bool votingState = voting.state();
        if(votingState == false && result == true){
            completeCheckpoints();
        }
        emit VoteEvent(
            votingState,
            HasVoted,
            result
        );
        
    }
}