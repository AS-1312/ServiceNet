export const YellowSessionManagerAbi = [
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "sessionId",
				"type": "bytes32"
			}
		],
		"name": "closeSession",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_serviceNet",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_usdc",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "serviceNode",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "duration",
				"type": "uint256"
			}
		],
		"name": "openSession",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "sessionId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "calls",
				"type": "uint256"
			}
		],
		"name": "recordUsage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "SafeERC20FailedOperation",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "SessionExpired",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "SessionNotActive",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "Unauthorized",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "sessionId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalCalls",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalSpent",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "refunded",
				"type": "uint256"
			}
		],
		"name": "SessionClosed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "sessionId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "serviceNode",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "consumer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			}
		],
		"name": "SessionOpened",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "sessionId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "calls",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "spent",
				"type": "uint256"
			}
		],
		"name": "SessionUsed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "sessionId",
				"type": "bytes32"
			}
		],
		"name": "getSession",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "sessionId",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "serviceNode",
						"type": "bytes32"
					},
					{
						"internalType": "address",
						"name": "consumer",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "provider",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "allowance",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "spent",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "callsMade",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "pricePerCall",
						"type": "uint256"
					},
					{
						"internalType": "uint64",
						"name": "openedAt",
						"type": "uint64"
					},
					{
						"internalType": "uint64",
						"name": "expiresAt",
						"type": "uint64"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct YellowSessionManager.Session",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "sessionId",
				"type": "bytes32"
			}
		],
		"name": "getSessionBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "spent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "remaining",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserSessions",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "sessionId",
				"type": "bytes32"
			}
		],
		"name": "isSessionActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SERVICE_NET",
		"outputs": [
			{
				"internalType": "contract ServiceNet",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sessionCount",
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
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "sessions",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "sessionId",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "serviceNode",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "consumer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "provider",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "spent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "callsMade",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pricePerCall",
				"type": "uint256"
			},
			{
				"internalType": "uint64",
				"name": "openedAt",
				"type": "uint64"
			},
			{
				"internalType": "uint64",
				"name": "expiresAt",
				"type": "uint64"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "USDC",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userSessions",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];