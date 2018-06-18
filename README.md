# Ethereum address validator

[![CircleCI](https://circleci.com/gh/ango-inc/ethereum-address-validator/tree/master.svg?style=svg)](https://circleci.com/gh/ango-inc/ethereum-address-validator/tree/master)
![MIT](https://camo.githubusercontent.com/890acbdcb87868b382af9a4b1fac507b9659d9bf/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d626c75652e737667)

We host this service at the following url. Please keep in mind that we do not guarantee the reliability.

https://ethereum-address-validator.ango.cash/

## Overview

This is a service to __validate ethereum address__ . The validity falls into two types: 1. if the input address is ethereum address; 2. if the address is owned by the callers. Although you can validate these by making them broadcast the transaction, it requires the time and money. With this service, you can make it more easily and quickly for free.

## How it works

The validation logic uses ecrecover and [secp256k1](https://en.bitcoin.it/wiki/Secp256k1). Using them, you can extract an ethereum address from signature without private information.

First, you prepare a message and generate SHA256 or SHA3 hash of it, then sign the hashed message with your account. There are some ways to sign. After signing it, call POST method to this server with the message, the signature, and an ethereum address. If the signature is generated with a correct account, the response will be success.

### Example of signing

Open a browser that installed [Metamask](https://metamask.io/), and open developer tools. After signing in to Metamask, you can call `web3` methods in a developer console. You can get a signature like following.

```
> const message = 'test'

> const msgHash = web3.sha3(message)

> web3.eth.sign(web3.eth.accounts[0], msgHash, (err, sign) => console.log(sign))
# Then Metamask pops up
```

Here is another example using private key directly.

```javascript
// SHA256
const eth = require('ethereumjs-util')
const message = 'test'
const privateKey = 'REPLACE THIS TEXT WITH YOUR PRIVATE KEY'
const msgHash = eth.toBuffer(eth.sha256(message))
const key = eth.toBuffer(privateKey)
const sigParams = eth.ecsign(msgHash, key)
const signature = eth.toRpcSig(sigParams.v, sigParams.r, sigParams.s)

// This is OK as well
// SHA3
const eth = require('ethereumjs-util')
const Web = require('web3')
const web3 = new Web3()
const message = 'test'
const privateKey = 'REPLACE THIS TEXT WITH YOUR PRIVATE KEY'
const msgHash = eth.toBuffer(web3.sha3(message))
const key = eth.toBuffer(privateKey)
const sigParams = eth.ecsign(msgHash, key)
const signature = eth.toRpcSig(sigParams.v, sigParams.r, sigParams.s)
```


## API document

### [POST] https://ethereum-address-validator.ango.cash/

#### Request Header

- `Content-Type: application/json`

#### Request Body

- `ethereum_address (string, required)` : secp256k1 signed ethereum address
- `signature (string, required)` : secp256k1 signed message
- `message (string, required)` : raw message (no hashing)

#### Response

##### Validation Success

```
200 OK
```

```json
{
  "isValid": true,
  "invalidReason": null
}
```

- `isValid (boolean, required)` : Validation result
- `invalidReason (string, required)` : `null`


##### Validation Failure

```
200 OK
```

```json
{
  "isValid": false,
  "invalidReason": "Ethereum address is invalid"
}
```

- `isValid (boolean, required)` : Validation result
- `invalidReason (string, required)` : Explanation why it fails validation


##### Error

```
400 Bad Request
```

```json
{
  "message": "Invalid request",
  "request": {
    "signature": "testtest"
  }
}
```

- `message (string, required)` : Error message
- `request (object, optional)` : Request body

## How to run locally

- Environments
  - node v8.9.3
  - yarn v1.2.1


```bash
$ yarn
$ yarn start

# use localhost:9999
```

## License

MIT © ANGO Pte. Ltd.
