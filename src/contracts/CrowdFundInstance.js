import web3 from './web3';
const address = "0x0c36E043dccFCF89313feA2141176d129e6aAaf7";
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
			}
		],
		"name": "ProjectStarted",
		"type": "event"
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
			}
		],
		"name": "startProject",
		"outputs": [],
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
	}
]
const instance = new web3.eth.Contract(abi, address);

export default instance;