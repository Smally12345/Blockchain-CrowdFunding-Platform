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
        address payable[] backers
    );
    
    event Checkpoint(
        uint paid,
        uint CompletedCheckpoints,
        State state
    );
    
    event Trigger(
        bool votingState,
        uint votingTime
    );
    
    event VoteEvent(
        bool votingState,
        bool[] HasVoted,
        bool result
    );
    
    event Refund(
        uint Currentbalance,
        uint Paid,
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
    address payable[] public backers;
    Voting public voting;
    Voting public refundVoting;
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
        refundVoting = new Voting(0);
    }
    
    
    // getter Functions
    function getDetails() external view returns(address payable Creator, string memory ProjectTitle, string memory ProjectDesc, uint AmountGoal, uint Deadline, uint CurrentBal, State CurrentState, uint total_checkpoints, uint completed_checkpoints, uint Paid, address payable[] memory Backers){
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
    
    function getVoteDetails() external view returns(bool votingState, bool[] memory HasVoted, uint YesCount, uint NoCount, bool result, uint votingTime){
        votingState = voting.state();
        YesCount = voting.yesCount();
        NoCount = voting.noCount();
        HasVoted = voting.getHasVoted();
        result = voting.result();
        votingTime = voting.RemainingTime();
    }
    
    function getRefundVoteDetails() external view returns(bool refundVotingState, bool[] memory refundHasVoted, uint refundYesCount, uint refundNoCount, bool refundResult, uint refundVotingTime){
        refundVotingState = refundVoting.state();
        refundYesCount = refundVoting.yesCount();
        refundNoCount = refundVoting.noCount();
        refundHasVoted = refundVoting.getHasVoted();
        refundResult = refundVoting.result();
        refundVotingTime = refundVoting.RemainingTime();
    }
    
    // Fund ether Functions
    function contribute() external payable {
        require(msg.sender != creator);
        require(msg.value > 0);
        if(contributions[msg.sender] == 0){
            backers.push(msg.sender);
        }
        contributions[msg.sender] = contributions[msg.sender].add(msg.value);
        currentbalance = currentbalance.add(msg.value);
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
    
    // Checkpoint and Approval Voting Functions
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
        require(msg.sender == creator);
        voting = new Voting(backers.length);
        voting.trigger();
        bool votingState = voting.state();
        uint votingTime = voting.RemainingTime();
        emit Trigger(
            votingState,
            votingTime
        );
    }
    
    function Vote(bool choice, uint idx) public {
        require(msg.sender != creator);
        voting.vote(choice, idx);
        bool result = voting.result();
        bool[] memory HasVoted = voting.getHasVoted();
        bool votingState = voting.state();
        if(votingState == false && result == true){
            completeCheckpoints();
        }
        else if(votingState == false && result == false){
            triggerRefundVoting();
        }
        emit VoteEvent(
            votingState,
            HasVoted,
            result
        );
    }
    
    function endVoting() public {
        require(msg.sender == creator);
        voting.endVoting();
        bool result = voting.result();
        bool[] memory HasVoted = voting.getHasVoted();
        bool votingState = voting.state();
        completeCheckpoints();
        emit VoteEvent(
            votingState,
            HasVoted,
            result
        );
    }
    
    // Refund Functions
    
    function refund() private {
        uint[] memory fundPerc = new uint[](backers.length);
        for(uint i = 0; i < backers.length; i++){
            uint fundAmt = contributions[backers[i]];
            fundPerc[i] = fundAmt.mul(100).div(currentbalance);
        }
        uint funds = currentbalance.sub(paid);
        for(uint i = 0; i < backers.length; i++){
            uint refundAmt = fundPerc[i].mul(funds).div(100);
            backers[i].transfer(refundAmt);
        }
        currentbalance = 0;
        paid = 0;
        state = State.expired;
        emit Refund(
            currentbalance,
            paid,
            state
        );
    }
    
    function triggerRefundVoting() private {
        refundVoting = new Voting(backers.length);
        refundVoting.trigger();
        bool refundVotingState = refundVoting.state();
        uint refundVotingTime = refundVoting.RemainingTime();
        emit Trigger(
            refundVotingState,
            refundVotingTime
        );
    }
    
    function refundVote(bool choice, uint idx) public {
        require(msg.sender != creator);
        refundVoting.vote(choice, idx);
        bool refundResult = refundVoting.result();
        bool[] memory refundHasVoted = refundVoting.getHasVoted();
        bool refundVotingState = refundVoting.state();
        if(refundVotingState == false && refundResult == true){
            refund();
        }
        emit VoteEvent(
            refundVotingState,
            refundHasVoted,
            refundResult
        );
    }
    
    function endRefundVoting() public {
        require(msg.sender == creator);
        refundVoting.endVoting();
        bool refundResult = refundVoting.result();
        bool[] memory refundHasVoted = refundVoting.getHasVoted();
        bool refundVotingState = refundVoting.state();
        emit VoteEvent(
            refundVotingState,
            refundHasVoted,
            refundResult
        );
    }
}