export const ERC20 = [
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        stateMutability: 'view',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'address'
            },
            {
                name: '',
                type: 'address'
            }
        ],
        name: 'allowance',
        stateMutability: 'view',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        type: 'function'
    },
    {
        inputs: [
            {
                name: '',
                type: 'address'
            },
            {
                name: '',
                type: 'uint256'
            }
        ],
        name: 'approve',
        outputs: [],
        payable: false,
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                name: '',
                type: 'uint8'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                name: '',
                type: 'string'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
            {
                name: '',
                type: 'string'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
]

export const ERC20_BYTE32 = [
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                name: '',
                type: 'uint8'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                name: '',
                type: 'bytes32'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
            {
                name: '',
                type: 'bytes32'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
]

export const ERC20_UPPER_CASE = [
    {
        constant: true,
        inputs: [],
        name: 'NAME',
        outputs: [
            {
                name: '',
                type: 'string'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'SYMBOL',
        outputs: [
            {
                name: '',
                type: 'string'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'DECIMALS',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
]
