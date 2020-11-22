pragma solidity ^0.6.6;
import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';
import './Project.sol';
contract CrowdFund{
    using SafeMath for uint256;
    Project[] private projects;
     event ProjectStarted(
        address contractAddress,
        address projectCreator,
        string projectTitle,
        string projectDesc,
        uint256 deadline,
        uint256 goal,
        uint256 TotalCheckpoints
    );
    function startProject(string calldata title, string calldata desc, uint goal, uint deadlineInDays, uint TotalCheckpoints) external {
        uint deadline = now.add(deadlineInDays.mul(1 days));
        Project project = new Project(title, desc, goal, deadline, msg.sender, TotalCheckpoints);
        projects.push(project);
        emit ProjectStarted(
            address(project),
            msg.sender,
            title,
            desc,
            deadline,
            goal,
            TotalCheckpoints
        );
    }
    function returnAllProjects() external view returns(Project[] memory){
        return projects;
    }
}