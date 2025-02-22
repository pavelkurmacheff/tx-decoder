# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/1inch/tx-decoder/compare/v1.2.0...v1.2.1) (2022-02-10)


### Bug Fixes

* fix 1inch contract ABI ([d19d4da](https://github.com/1inch/tx-decoder/commit/d19d4dad60b9dd3eaeef0bb5f6871d2cbbd1e8c1))

## [1.2.0](https://github.com/1inch/tx-decoder/compare/v1.1.13...v1.2.0) (2022-01-18)


### Bug Fixes

* decode estimation result using ABI ([b5ac612](https://github.com/1inch/tx-decoder/commit/b5ac6125625114abe5051bc0b2bd55c1565b2875))
* update docs ([10c63b4](https://github.com/1inch/tx-decoder/commit/10c63b41ae4b2a2012dcd8e22e1258d0d7e0b506))

### [1.1.13](https://github.com/1inch/tx-decoder/compare/v1.1.12...v1.1.13) (2021-12-30)


### Features

* add example app ([#2](https://github.com/1inch/tx-decoder/issues/2)) ([f889c0e](https://github.com/1inch/tx-decoder/commit/f889c0e860e7ed140d3de5d2d4aa3e259fe30efe))
* add example app ([#3](https://github.com/1inch/tx-decoder/issues/3)) ([3654284](https://github.com/1inch/tx-decoder/commit/3654284832deb7b0f0200fa1ef991619c3097e11))


### Bug Fixes

* add logoURI to token interface ([6c3e543](https://github.com/1inch/tx-decoder/commit/6c3e54305acdd9049e34e9960ee08d0fc9196942))
* fix uni pools decoding ([0bc8e91](https://github.com/1inch/tx-decoder/commit/0bc8e91b13fd318a2eccd230746d5e4313526c3b))

### [1.1.12](https://github.com/1inch/tx-decoder/compare/v1.1.11...v1.1.12) (2021-12-28)


### Features

* add possibility to use TxConfirmDataBuilder with tx hash ([d44b47e](https://github.com/1inch/tx-decoder/commit/d44b47e309aa840afcf88148fb40ffd6f23cca0b))

### [1.1.11](https://github.com/1inch/tx-decoder/compare/v1.1.10...v1.1.11) (2021-12-24)


### Bug Fixes

* fix getTokensOfUniswapV3Pools() ([d2d9035](https://github.com/1inch/tx-decoder/commit/d2d9035c0cde2a5849ed9768273ca5c6f7acfd31))

### [1.1.10](https://github.com/1inch/tx-decoder/compare/v1.1.9...v1.1.10) (2021-12-24)


### Bug Fixes

* fix value for getDestAmountViaEstimation() ([150af8f](https://github.com/1inch/tx-decoder/commit/150af8fe01f1fa75e914982d0d49ac8e296e8179))

### [1.1.9](https://github.com/1inch/tx-decoder/compare/v1.1.8...v1.1.9) (2021-12-24)


### Bug Fixes

* fix tx decoding by estimation ([d6e02db](https://github.com/1inch/tx-decoder/commit/d6e02db0665661795e2f5437a2b5eb028c3dffbb))

### [1.1.8](https://github.com/1inch/tx-decoder/compare/v1.1.7...v1.1.8) (2021-12-15)

### [1.1.7](https://github.com/1inch/tx-decoder/compare/v1.1.6...v1.1.7) (2021-12-15)


### Features

* add raw arguments from callData to result ([c95d502](https://github.com/1inch/tx-decoder/commit/c95d5026129d77a28dad1f371781c04471985c8e))

### [1.1.6](https://github.com/1inch/tx-decoder/compare/v1.1.5...v1.1.6) (2021-12-14)


### Features

* don't become broken when estimation failed ([bb18a25](https://github.com/1inch/tx-decoder/commit/bb18a25c76527fb29b593daadc1ea6c28c2f5ce1))
* use network from wallet on demo page ([3301073](https://github.com/1inch/tx-decoder/commit/3301073f4c61529ae0510b843795448666bab951))

### [1.1.5](https://github.com/1inch/tx-decoder/compare/v1.1.4...v1.1.5) (2021-12-13)

### [1.1.4](https://github.com/1inch/tx-decoder/compare/v1.1.3...v1.1.4) (2021-12-13)


### Bug Fixes

* add second parameter to rpc call ([aaa2834](https://github.com/1inch/tx-decoder/commit/aaa283494e50789219992a59224fc76880a8cc53))

### [1.1.3](https://github.com/1inch/tx-decoder/compare/v1.1.2...v1.1.3) (2021-11-22)


### Bug Fixes

* fix getReturnAmountFromLogs ([a16ed83](https://github.com/1inch/tx-decoder/commit/a16ed83731a348708068f87195dd5535ed70658f))

### [1.1.2](https://github.com/1inch/tx-decoder/compare/v1.1.1...v1.1.2) (2021-11-22)


### Bug Fixes

* enforce typing for TxDecoder ([6c9e394](https://github.com/1inch/tx-decoder/commit/6c9e39421bdb7cf9f265a243d666118eeee7eb79))
* fix getReturnAmountFromLogs ([0ec149e](https://github.com/1inch/tx-decoder/commit/0ec149e5eb2b4d046a854502c2d7b42e03235451))

### [1.1.1](https://github.com/1inch/tx-decoder/compare/v1.1.0...v1.1.1) (2021-11-22)


### ⚠ BREAKING CHANGES

* OinchTxDecoder with two modes - decode by logs and decode by estimation

### Features

* add byEstimation or byLogs options to demo page ([027e683](https://github.com/1inch/tx-decoder/commit/027e683a4d33ffd8eb48a1288bc5a46de8e46e9d))
* OinchTxDecoder with two modes - decode by logs and decode by estimation ([597403d](https://github.com/1inch/tx-decoder/commit/597403d53219425978817740d1eeadf0f2862732))

## 1.1.0 (2021-11-22)


### Bug Fixes

* fix tx dest amount estimation ([4f9ad30](https://github.com/1inch/tx-decoder/commit/4f9ad30ac57db9b93649ad40650d19d1043b1db8))
