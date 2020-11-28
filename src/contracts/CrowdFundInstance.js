import web3 from './web3';
const address = "0x347f519F072f4Bc1F9cd7DD44F8968ac78a69ab4";
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contractAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "projectCreator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "projectTitle",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "projectDesc",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "goal",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "TotalCheckpoints",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "imgHash",
				"type": "string"
			}
		],
		"name": "ProjectStarted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "deleteProject",
		"outputs": [
			{
				"internalType": "contract Project[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "returnAllProjects",
		"outputs": [
			{
				"internalType": "contract Project[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "desc",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "goal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadlineInDays",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "TotalCheckpoints",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "imgHash",
				"type": "string"
			}
		],
		"name": "startProject",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const instance = new web3.eth.Contract(abi, address);

export default instance;