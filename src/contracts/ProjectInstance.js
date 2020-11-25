import web3 from './web3';
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_desc",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_goal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_deadline",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_totalCP",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "paid",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "CompletedCheckpoints",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum Project.State",
				"name": "state",
				"type": "uint8"
			}
		],
		"name": "Checkpoint",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "CurrentBalance",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum Project.State",
				"name": "state",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "address payable[]",
				"name": "backers",
				"type": "address[]"
			}
		],
		"name": "Fund",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "Currentbalance",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "Paid",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum Project.State",
				"name": "state",
				"type": "uint8"
			}
		],
		"name": "Refund",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "votingState",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "votingTime",
				"type": "uint256"
			}
		],
		"name": "Trigger",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "votingState",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "bool[]",
				"name": "HasVoted",
				"type": "bool[]"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "result",
				"type": "bool"
			}
		],
		"name": "VoteEvent",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "CompletedCheckpoints",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TotalCheckpoints",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "choice",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "idx",
				"type": "uint256"
			}
		],
		"name": "Vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "backers",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "completeCheckpoints",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contributions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "creator",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentbalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deadline",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "desc",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endRefundVoting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endVoting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDetails",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "Creator",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "ProjectTitle",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ProjectDesc",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "AmountGoal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "Deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "CurrentBal",
				"type": "uint256"
			},
			{
				"internalType": "enum Project.State",
				"name": "CurrentState",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "total_checkpoints",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "completed_checkpoints",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "Paid",
				"type": "uint256"
			},
			{
				"internalType": "address payable[]",
				"name": "Backers",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRefundVoteDetails",
		"outputs": [
			{
				"internalType": "bool",
				"name": "refundVotingState",
				"type": "bool"
			},
			{
				"internalType": "bool[]",
				"name": "refundHasVoted",
				"type": "bool[]"
			},
			{
				"internalType": "uint256",
				"name": "refundYesCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "refundNoCount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "refundResult",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "refundVotingTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getVoteDetails",
		"outputs": [
			{
				"internalType": "bool",
				"name": "votingState",
				"type": "bool"
			},
			{
				"internalType": "bool[]",
				"name": "HasVoted",
				"type": "bool[]"
			},
			{
				"internalType": "uint256",
				"name": "YesCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "NoCount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "result",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "votingTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "goal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "choice",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "idx",
				"type": "uint256"
			}
		],
		"name": "refundVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "refundVoting",
		"outputs": [
			{
				"internalType": "contract Voting",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "state",
		"outputs": [
			{
				"internalType": "enum Project.State",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "title",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "toPay",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "triggerVoting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "voting",
		"outputs": [
			{
				"internalType": "contract Voting",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
export default (address) => {
    const instance = new web3.eth.Contract(abi, address);
    return instance;
};