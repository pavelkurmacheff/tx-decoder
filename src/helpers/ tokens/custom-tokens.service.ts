import { ChainTokenByNetwork, NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from '../../const/common.const';
import { BlockchainRpcCaller, Token } from '../../model/common.model';

export class CustomTokensService {
  private customTokensMap: {[key: string]: Token} = {}

  constructor(
      readonly rpcCaller: BlockchainRpcCaller
  ) {
    this.customTokensMap[ZERO_ADDRESS] = ChainTokenByNetwork[config.chain_id]
    this.customTokensMap[NATIVE_TOKEN_ADDRESS] = ChainTokenByNetwork[config.chain_id]
  }

  async getTokenByAddress(address: string): Promise<Token | null> {
    try {
      if (this.customTokensMap[address]) {
        return this.customTokensMap[address]
      }

      const data = await this.fetchTokenInfo(address.toLowerCase())
      if (!data) {
        return null
      }
      if (data.decimals === null || data.decimals === undefined) {
        return null
      }

      const info = this.buildMinimizedTokenFromData(data)

      this.customTokensMap[address] = info

      return info
    } catch (e) {
      console.error(e)
      return null
    }
  }

  buildMinimizedTokenFromData(data: Token): Token {
    const info: Token = {
      name: data.name,
      symbol: data.symbol,
      address: data.address
    }

    if (data.decimals !== 18) {
      info.decimals = data.decimals
    }
    if (data.logoURI) {
      info.logoURI = data.logoURI
    }
    return info
  }

  async fetchTokenInfo(address: string): Promise<Token | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      return new Promise(async (resolve, reject) => {
        try {
          resolve(await this.fetchNormalTokenInfo(address))
        } catch (e) {
          if (isUpperCaseToken(e)) {
            try {
              resolve(await this.fetchUpperCaseTokenInfo(address))
            } catch (e) {
              console.error(e)
            }
          } else if (isBytes32TokenInfo(e)) {
            try {
              resolve(await this.fetchBytes32TokenInfo(address))
            } catch (e) {
              console.error(e)
            }
          }
        }
        reject('cannot fetch details for token: ' + address)
      })
    } catch (e) {
      return null
    }
  }

  private async fetchNormalTokenInfo(tokenAddress: string): Promise<TokenDto> {
    const token = new this.web3Service.web3.eth.Contract(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ERC20,
      tokenAddress
    )

    return {
      symbol: await token.methods.symbol().call(),
      name: await token.methods.name().call(),
      address: tokenAddress,
      decimals: Number((await token.methods.decimals().call()).toString())
    }
  }

  private async fetchUpperCaseTokenInfo(
    tokenAddress: string
  ): Promise<Token> {
    const token = new this.web3Service.web3.eth.Contract(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ERC20_UPPER_CASE,
      tokenAddress
    )

    return {
      symbol: await token.methods.SYMBOL().call(),
      name: await token.methods.NAME().call(),
      address: tokenAddress,
      decimals: Number((await token.methods.DECIMALS().call()).toString())
    }
  }

  private async fetchBytes32TokenInfo(tokenAddress: string): Promise<Token> {
    const token = new this.web3Service.web3.eth.Contract(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ERC20_BYTE32,
      tokenAddress
    )

    return {
      symbol: this.web3Service.web3.utils.hexToUtf8(
        await token.methods.symbol().call()
      ),
      name: this.web3Service.web3.utils.hexToUtf8(
        await token.methods.name().call()
      ),
      address: tokenAddress,
      decimals: Number((await token.methods.decimals().call()).toString())
    }
  }
}
