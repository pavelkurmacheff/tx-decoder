
import Web3 from 'web3'
import { AbiItem } from 'web3-utils';

export class Web3Service {
    public readonly web3;

    constructor(rpc: string) {
        this.web3 = new Web3(rpc)
    }


  getInstance(abi: unknown, address: string | undefined = undefined): unknown {
    return new this.web3.eth.Contract(abi as (AbiItem[] | AbiItem), address)
  }

  checksumAddress(address: string): string {
    return web3NoNetwork.utils.toChecksumAddress(address)
  }
}

const web3NoNetwork = new Web3('')

export function decodeParameter(type: unknown /*SolType*/, data: string): string {
  return web3NoNetwork.eth.abi.decodeParameter(type, data).toString()
}

export function decodeManyParameters(types: string[], data: string): string[] {
  const res: string[] = []
  for (const [i, type] of types.entries()) {
    res.push(decodeParameter(type, '0x' + data.slice(i * 64, 64 * (i + 1))))
  }
  return res
}

export function decodeParameters(typeMap: unknown[] /*SolType*/, data: string): unknown {
  return web3NoNetwork.eth.abi.decodeParameters(typeMap, data)
}

export function isValidAddress(address: string): boolean {
  return web3NoNetwork.utils.isAddress(address)
}

export function decodeError(e: string): string {
  return web3NoNetwork.utils.hexToAscii(e)
}
