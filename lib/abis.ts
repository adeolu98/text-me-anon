export const EAOChecker_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "isEAO",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]


  export const MULTICALL_ABI = [
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "targets",
				"type": "address[]"
			},
			{
				"internalType": "bytes[]",
				"name": "data",
				"type": "bytes[]"
			}
		],
		"name": "multiCall",
		"outputs": [
			{
				"internalType": "bytes[]",
				"name": "",
				"type": "bytes[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]