import ethers from 'ethers'
import Onboard from 'bnc-onboard'
import Notify from "bnc-notify"

import { writable, derived, get } from 'svelte/store'
import getSigner from './signer'

// let provider = ethers.getDefaultProvider('homestead')
let provider = ethers.getDefaultProvider('rinkeby')

// let DAI_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359' // mainnet
let DAI_ADDRESS = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa' // rinkeby
let DAI_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'stop',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'owner_', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'src', type: 'address' },
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'wad', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'name_', type: 'bytes32' }],
    name: 'setName',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'src', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'stopped',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'authority_', type: 'address' }],
    name: 'setAuthority',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'burn',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'wad', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'push',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'src', type: 'address' },
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'move',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'start',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'guy', type: 'address' }],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'src', type: 'address' },
      { name: 'guy', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'src', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'pull',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'symbol_', type: 'bytes32' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Mint',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Burn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'authority', type: 'address' }],
    name: 'LogSetAuthority',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'owner', type: 'address' }],
    name: 'LogSetOwner',
    type: 'event'
  },
  {
    anonymous: true,
    inputs: [
      { indexed: true, name: 'sig', type: 'bytes4' },
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: true, name: 'foo', type: 'bytes32' },
      { indexed: true, name: 'bar', type: 'bytes32' },
      { indexed: false, name: 'wad', type: 'uint256' },
      { indexed: false, name: 'fax', type: 'bytes' }
    ],
    name: 'LogNote',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  }
]
// let UNISWAP_ADDRESS = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95' // mainnet
let UNISWAP_ADDRESS = '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36' // rinkeby
let UNISWAP_ABI = [
  {
    name: 'NewExchange',
    inputs: [
      { type: 'address', name: 'token', indexed: true },
      { type: 'address', name: 'exchange', indexed: true }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'initializeFactory',
    outputs: [],
    inputs: [{ type: 'address', name: 'template' }],
    constant: false,
    payable: false,
    type: 'function',
    gas: 35725
  },
  {
    name: 'createExchange',
    outputs: [{ type: 'address', name: 'out' }],
    inputs: [{ type: 'address', name: 'token' }],
    constant: false,
    payable: false,
    type: 'function',
    gas: 187911
  },
  {
    name: 'getExchange',
    outputs: [{ type: 'address', name: 'out' }],
    inputs: [{ type: 'address', name: 'token' }],
    constant: true,
    payable: false,
    type: 'function',
    gas: 715
  },
  {
    name: 'getToken',
    outputs: [{ type: 'address', name: 'out' }],
    inputs: [{ type: 'address', name: 'exchange' }],
    constant: true,
    payable: false,
    type: 'function',
    gas: 745
  },
  {
    name: 'getTokenWithId',
    outputs: [{ type: 'address', name: 'out' }],
    inputs: [{ type: 'uint256', name: 'token_id' }],
    constant: true,
    payable: false,
    type: 'function',
    gas: 736
  },
  {
    name: 'exchangeTemplate',
    outputs: [{ type: 'address', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 633
  },
  {
    name: 'tokenCount',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 663
  }
]
let UNISWAP_EXCHANGE_ABI = [
  {
    name: 'TokenPurchase',
    inputs: [
      { type: 'address', name: 'buyer', indexed: true },
      { type: 'uint256', name: 'eth_sold', indexed: true },
      { type: 'uint256', name: 'tokens_bought', indexed: true }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'EthPurchase',
    inputs: [
      { type: 'address', name: 'buyer', indexed: true },
      { type: 'uint256', name: 'tokens_sold', indexed: true },
      { type: 'uint256', name: 'eth_bought', indexed: true }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'AddLiquidity',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256', name: 'eth_amount', indexed: true },
      { type: 'uint256', name: 'token_amount', indexed: true }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidity',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256', name: 'eth_amount', indexed: true },
      { type: 'uint256', name: 'token_amount', indexed: true }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'Transfer',
    inputs: [
      { type: 'address', name: '_from', indexed: true },
      { type: 'address', name: '_to', indexed: true },
      { type: 'uint256', name: '_value', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'Approval',
    inputs: [
      { type: 'address', name: '_owner', indexed: true },
      { type: 'address', name: '_spender', indexed: true },
      { type: 'uint256', name: '_value', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'setup',
    outputs: [],
    inputs: [{ type: 'address', name: 'token_addr' }],
    constant: false,
    payable: false,
    type: 'function',
    gas: 175875
  },
  {
    name: 'addLiquidity',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'min_liquidity' },
      { type: 'uint256', name: 'max_tokens' },
      { type: 'uint256', name: 'deadline' }
    ],
    constant: false,
    payable: true,
    type: 'function',
    gas: 82605
  },
  {
    name: 'removeLiquidity',
    outputs: [
      { type: 'uint256', name: 'out' },
      { type: 'uint256', name: 'out' }
    ],
    inputs: [
      { type: 'uint256', name: 'amount' },
      { type: 'uint256', name: 'min_eth' },
      { type: 'uint256', name: 'min_tokens' },
      { type: 'uint256', name: 'deadline' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 116814
  },
  {
    name: '__default__',
    outputs: [],
    inputs: [],
    constant: false,
    payable: true,
    type: 'function'
  },
  {
    name: 'ethToTokenSwapInput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'min_tokens' },
      { type: 'uint256', name: 'deadline' }
    ],
    constant: false,
    payable: true,
    type: 'function',
    gas: 12757
  },
  {
    name: 'ethToTokenTransferInput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'min_tokens' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'recipient' }
    ],
    constant: false,
    payable: true,
    type: 'function',
    gas: 12965
  },
  {
    name: 'ethToTokenSwapOutput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_bought' },
      { type: 'uint256', name: 'deadline' }
    ],
    constant: false,
    payable: true,
    type: 'function',
    gas: 50455
  },
  {
    name: 'ethToTokenTransferOutput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_bought' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'recipient' }
    ],
    constant: false,
    payable: true,
    type: 'function',
    gas: 50663
  },
  {
    name: 'tokenToEthSwapInput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_sold' },
      { type: 'uint256', name: 'min_eth' },
      { type: 'uint256', name: 'deadline' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 47503
  },
  {
    name: 'tokenToEthTransferInput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_sold' },
      { type: 'uint256', name: 'min_eth' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'recipient' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 47712
  },
  {
    name: 'tokenToEthSwapOutput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'eth_bought' },
      { type: 'uint256', name: 'max_tokens' },
      { type: 'uint256', name: 'deadline' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 50175
  },
  {
    name: 'tokenToEthTransferOutput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'eth_bought' },
      { type: 'uint256', name: 'max_tokens' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'recipient' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 50384
  },
  {
    name: 'tokenToTokenSwapInput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_sold' },
      { type: 'uint256', name: 'min_tokens_bought' },
      { type: 'uint256', name: 'min_eth_bought' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'token_addr' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 51007
  },
  {
    name: 'tokenToTokenTransferInput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_sold' },
      { type: 'uint256', name: 'min_tokens_bought' },
      { type: 'uint256', name: 'min_eth_bought' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'recipient' },
      { type: 'address', name: 'token_addr' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 51098
  },
  {
    name: 'tokenToTokenSwapOutput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_bought' },
      { type: 'uint256', name: 'max_tokens_sold' },
      { type: 'uint256', name: 'max_eth_sold' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'token_addr' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 54928
  },
  {
    name: 'tokenToTokenTransferOutput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_bought' },
      { type: 'uint256', name: 'max_tokens_sold' },
      { type: 'uint256', name: 'max_eth_sold' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'recipient' },
      { type: 'address', name: 'token_addr' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 55019
  },
  {
    name: 'tokenToExchangeSwapInput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_sold' },
      { type: 'uint256', name: 'min_tokens_bought' },
      { type: 'uint256', name: 'min_eth_bought' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'exchange_addr' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 49342
  },
  {
    name: 'tokenToExchangeTransferInput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_sold' },
      { type: 'uint256', name: 'min_tokens_bought' },
      { type: 'uint256', name: 'min_eth_bought' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'recipient' },
      { type: 'address', name: 'exchange_addr' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 49532
  },
  {
    name: 'tokenToExchangeSwapOutput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_bought' },
      { type: 'uint256', name: 'max_tokens_sold' },
      { type: 'uint256', name: 'max_eth_sold' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'exchange_addr' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 53233
  },
  {
    name: 'tokenToExchangeTransferOutput',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256', name: 'tokens_bought' },
      { type: 'uint256', name: 'max_tokens_sold' },
      { type: 'uint256', name: 'max_eth_sold' },
      { type: 'uint256', name: 'deadline' },
      { type: 'address', name: 'recipient' },
      { type: 'address', name: 'exchange_addr' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 53423
  },
  {
    name: 'getEthToTokenInputPrice',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [{ type: 'uint256', name: 'eth_sold' }],
    constant: true,
    payable: false,
    type: 'function',
    gas: 5542
  },
  {
    name: 'getEthToTokenOutputPrice',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [{ type: 'uint256', name: 'tokens_bought' }],
    constant: true,
    payable: false,
    type: 'function',
    gas: 6872
  },
  {
    name: 'getTokenToEthInputPrice',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [{ type: 'uint256', name: 'tokens_sold' }],
    constant: true,
    payable: false,
    type: 'function',
    gas: 5637
  },
  {
    name: 'getTokenToEthOutputPrice',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [{ type: 'uint256', name: 'eth_bought' }],
    constant: true,
    payable: false,
    type: 'function',
    gas: 6897
  },
  {
    name: 'tokenAddress',
    outputs: [{ type: 'address', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1413
  },
  {
    name: 'factoryAddress',
    outputs: [{ type: 'address', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1443
  },
  {
    name: 'balanceOf',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [{ type: 'address', name: '_owner' }],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1645
  },
  {
    name: 'transfer',
    outputs: [{ type: 'bool', name: 'out' }],
    inputs: [
      { type: 'address', name: '_to' },
      { type: 'uint256', name: '_value' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 75034
  },
  {
    name: 'transferFrom',
    outputs: [{ type: 'bool', name: 'out' }],
    inputs: [
      { type: 'address', name: '_from' },
      { type: 'address', name: '_to' },
      { type: 'uint256', name: '_value' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 110907
  },
  {
    name: 'approve',
    outputs: [{ type: 'bool', name: 'out' }],
    inputs: [
      { type: 'address', name: '_spender' },
      { type: 'uint256', name: '_value' }
    ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 38769
  },
  {
    name: 'allowance',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'address', name: '_owner' },
      { type: 'address', name: '_spender' }
    ],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1925
  },
  {
    name: 'name',
    outputs: [{ type: 'bytes32', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1623
  },
  {
    name: 'symbol',
    outputs: [{ type: 'bytes32', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1653
  },
  {
    name: 'decimals',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1683
  },
  {
    name: 'totalSupply',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1713
  }
]
let HOODIE_DAPP_ADDRESS = '0xf8296b04890cc0f9b237cB056154893d71Df5214'
// let HOODIE_DAPP_ADDRESS = '0x3C6592DB105616B0ffeaA4ff49E2a04F16F2f155'
let HOODIE_DAPP_ABI = [
	{
		"constant": true,
		"inputs": [],
		"name": "getWaitingList",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "minimumDepositAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "topUpAmount",
				"type": "uint256"
			}
		],
		"name": "increaseDepositAmount",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "nextInLine",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "rDAIContract",
		"outputs": [
			{
				"internalType": "contract IRToken",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "issueFDH",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "doChangeHat",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "rDaiContractAddress",
				"type": "address"
			}
		],
		"name": "switchRDaiContractInstance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "DAIContract",
		"outputs": [
			{
				"internalType": "contract IDai",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "mostDeposited",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "roundNumber",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "proportion",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "hatID",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "recipient",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "proportions",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "numOfHoodie",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "rNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "depositedAmount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isWaiting",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "hoodieCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "recipients",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "depositAmount",
				"type": "uint256"
			}
		],
		"name": "mintRDaiAndPushUserToWaitingList",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "waitingList",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "redeemAmount",
				"type": "uint256"
			}
		],
		"name": "redeemRDai",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "daiContractAddress",
				"type": "address"
			}
		],
		"name": "switchDaiContractInstance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "hoodieReceivers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "depositedAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "roundNumber",
				"type": "uint256"
			}
		],
		"name": "UserPushedIntoWaitingList",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "recipientOfHoodie",
				"type": "address"
			}
		],
		"name": "IssuedFDH",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newRountNumber",
				"type": "uint256"
			}
		],
		"name": "NewRoundStarted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newDepositedAmount",
				"type": "uint256"
			}
		],
		"name": "IncreasedDeposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newDepositedAmount",
				"type": "uint256"
			}
		],
		"name": "RedeemedRDai",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	}
]
let R_DAI_ADDRESS = '0xb0C72645268E95696f5b6F40aa5b12E1eBdc8a5A'
let R_DAI_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'stop',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'owner_', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'src', type: 'address' },
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'wad', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'name_', type: 'bytes32' }],
    name: 'setName',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'src', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'stopped',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'authority_', type: 'address' }],
    name: 'setAuthority',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'burn',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'wad', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'push',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'src', type: 'address' },
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'move',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'start',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'guy', type: 'address' }],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'src', type: 'address' },
      { name: 'guy', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'src', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'pull',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'symbol_', type: 'bytes32' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Mint',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Burn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'authority', type: 'address' }],
    name: 'LogSetAuthority',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'owner', type: 'address' }],
    name: 'LogSetOwner',
    type: 'event'
  },
  {
    anonymous: true,
    inputs: [
      { indexed: true, name: 'sig', type: 'bytes4' },
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: true, name: 'foo', type: 'bytes32' },
      { indexed: true, name: 'bar', type: 'bytes32' },
      { indexed: false, name: 'wad', type: 'uint256' },
      { indexed: false, name: 'fax', type: 'bytes' }
    ],
    name: 'LogNote',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  }
]

let daiContract = new ethers.Contract(DAI_ADDRESS, DAI_ABI, provider)
let rDaiContract = new ethers.Contract(R_DAI_ADDRESS, R_DAI_ABI, provider)
let uniswapFactory = new ethers.Contract(
  UNISWAP_ADDRESS,
  UNISWAP_ABI,
  provider
  )
let hoodieDappContract = new ethers.Contract(HOODIE_DAPP_ADDRESS, HOODIE_DAPP_ABI, provider)
let daiExchangeAddress
let daiExchangeContract
let signer

let waitingList = writable([])
const store = {
  provider,
  emitter: writable(null),
  init: async ({ showSelect }) => {
    onboard.config({ darkMode: true })
    await onboard.walletSelect(showSelect ? null : 'MetaMask')
    await onboard.walletReady()
    daiExchangeAddress = await uniswapFactory.getExchange(DAI_ADDRESS)
    daiExchangeContract = new ethers.Contract(
      daiExchangeAddress,
      UNISWAP_EXCHANGE_ABI,
      provider
    )
    let acc = notify.account(get(store.address))
    store.emitter.set(acc.emitter)
  },
  ethRequiredForDai: async daiAmount => {
    // should be able to find out from uniswap how to purchase the DAI
    // Buy ERC20 with ETH
    const outputAmount = ethers.utils.parseEther(daiAmount.toString())
    const inputReserve = await provider.getBalance(daiExchangeAddress)
    const outputReserve = await daiContract.balanceOf(daiExchangeAddress)

    // Cost
    const numerator = outputAmount.mul(inputReserve).mul(1000)
    const denominator = outputReserve.sub(outputAmount).mul(997)
    const inputAmount = numerator.div(denominator).add(1)
    return inputAmount
  },
  purchaseDai: async daiAmount => {
    const outputAmount = ethers.utils.parseEther(daiAmount.toString())
    const inputAmount = await store.ethRequiredForDai(daiAmount)
    daiExchangeContract = daiExchangeContract.connect(signer)
    const tx = await daiExchangeContract.ethToTokenSwapInput(
      outputAmount,
      Math.floor(Date.now() / 1000 + 10000),
      {
        value: inputAmount,
        gasLimit: 50000
      }
    )
    return tx
  },
  depositDai: async daiAmount => {
    console.log({ daiAmount })
    // here we call keisaku's contract twice to deposit the DAI from the user's
    // wallet
    const daiAmountBn = ethers.utils.parseEther(daiAmount.toString())
    hoodieDappContract = hoodieDappContract.connect(signer)
    const tx = await hoodieDappContract.mintRDaiAndPushUserToWaitingList(daiAmountBn)
    return tx
  },
  approveDai: async daiAmount => {
    console.log({ daiAmount })
    const daiAmountBn = ethers.utils.parseEther(daiAmount.toString())
    daiContract = daiContract.connect(signer)
    const tx = await daiContract.approve(HOODIE_DAPP_ADDRESS, daiAmountBn)
    return tx
  },
  approveRDai: async (rDaiAmount) => {
    const rDaiAmountBn = ethers.utils.parseEther(rDaiAmount.toString())
    rDaiContract = rDaiContract.connect(signer)
    const tx = await rDaiContract.approve(HOODIE_DAPP_ADDRESS, rDaiAmountBn)
    return tx
  },
  withdrawDai: async (daiAmount) => {
    const daiAmountBn = ethers.utils.parseEther(daiAmount.toString())
    hoodieDappContract = hoodieDappContract.connect(signer)
    const tx = await hoodieDappContract.redeemRDai(daiAmountBn)
    return tx
  },
  getWaitingList: async () => {
    const waitingList = await hoodieDappContract.getWaitingList()
    store.populateWaitingList(waitingList)
    return waitingList
  },
  isOnWaitingList: async () => {
    const waitingList = get(store.waitingList)
    for (let user of waitingList) {
      console.log({user})
      console.log({address: get(store.address)})
      if (get(store.address).toLowerCase() === user.address.toLowerCase() && user.isWaiting) {
        return true
      }
    }
    return false
  },
  getDappDaiBalance: () => {
    // return await daiContract.balanceOf(HOODIE_DAPP_ADDRESS)
  },
  getDappInterestBalance: () => {

  },
  getMyDaiDeposit: () => {
    const waitingList = get(store.waitingList)
    console.log({waitingList})
    for (let user of waitingList) {
      if (get(store.address).toLowerCase() === user.address.toLowerCase()) {
        return ethers.utils.formatEther(user.depositedAmount)
      }
    }
    return 0
  },
  populateWaitingList: async (list) => {
    let promises = []
    for (let user of list) {
      promises.push(new Promise(async (resolve) => {
        const struct = await hoodieDappContract.users(user)
        struct.address = user
        resolve(struct)
      }))
    }
    const detailedList = await Promise.all(promises)
    waitingList.set(detailedList)
  },
  myWaitingListPosition: () => {
    const list = get(store.sortedWaitingList)
    let i = 0
    for (let user of list) {
      if (user.address.toLowerCase() === get(store.address).toLowerCase()) return store.formatPosition(i)
      i++
    }
  },
  balance: writable(0),
  address: writable(''),
  network: writable(0),
  daiBalance: writable(0),
  waitingList,
  sortedWaitingList: derived(waitingList, $newList => {
    console.log({$newList})
    return $newList.sort((a, b) => {
      if (a.depositedAmount.lt(b.depositedAmount)) {
        return 1
      } else if (a.depositedAmount.gt(b.depositedAmount)) {
        return -1
      }
    }).filter((u) => u.isWaiting)
  }, new Promise(() => {})),
  totalDaiDeposited: derived(waitingList, $list => {
    return $list.reduce((acc, user) => acc.add(user.depositedAmount), ethers.utils.bigNumberify(0))
  }),
  formatPosition: (pos) => {
    console.log({pos})
    const posString = pos.toString()
    const lastChar = posString.substr(pos.length - 1, 1)
    if (lastChar === '1') return posString + 'st'
    if (lastChar === '2') return posString + 'nd'
    if (lastChar === '3') return posString + 'rd'
    return posString + 'th'
  },
  saveEmailAddress: (email) => {
    // post the email to a server which saves it and posts it to discord
    store.emailSaved = true
  },
  emailSaved: false,
  txCallback: writable(() => {})
}

store.sortedWaitingList.subscribe(nl => {
  console.log({ nl })
})


const onboard = Onboard.init({
  dappId: '78761f7e-d978-4d9d-91c0-172e5d997116',
  networkId: 4,
  subscriptions: {
    address: async _address => {
      if (!_address) return
      const _daiBal = await daiContract.balanceOf(_address)
      console.log({ _daiBal })
      store.daiBalance.set(ethers.utils.formatEther(_daiBal))
      store.address.set(_address)
    },
    network: _network => store.network.set(_network),
    balance: _balance => {
      if (!_balance) return
      store.balance.set(ethers.utils.formatEther(_balance))
    },
    wallet: wallet => {
      console.log(
        'a new wallet has been selected by user',
        wallet.provider,
        wallet.name
      )
      if (wallet.provider) {
        provider = new ethers.providers.Web3Provider(wallet.provider)
        window.localStorage.setItem('selectedWallet', wallet.name)
        signer = getSigner(provider)
      }
    }
  },
  modules: {
    // default wallets that are included: MetaMask, Dapper, Coinbase, Trust, WalletConnect
    walletSelect: Onboard.modules.select.defaults({
      networkId: 4
    }),
    // default ready steps are: connect, network, balance
    walletReady: Onboard.modules.ready.defaults({
      networkId: 4
    })
  }
})

const notify = Notify({
  dappId: "78761f7e-d978-4d9d-91c0-172e5d997116",
  networkId: 4,
  transactionEvents: event => {
    get(store.txCallback)(event)
  }
})

export default store
