const eth = require('ethereumjs-util')
const Web3 = require('web3')
const web3 = new Web3()
/**
 * Validate ethereum address with signature and its message
 * @param {String} sig signed message with private key
 * @param {String} message something to sign
 * @param {String} address ethereum address to check
 * @returns {isValid: Bool, invalidReason: String?}
 */
const validate = (sig, message, address) => {
  if (!isValidEthAddress(address)) {
    return { isValid: false, invalidReason: 'Ethereum address is invalid' }
  }

  const messageWithSha3 = web3.sha3(message)
  const extractedAddressWithSha3 = extractEthAddress(sig, messageWithSha3)
  if (extractedAddressWithSha3 === address) {
    return { isValid: true, invalidReason: null }
  }

  const messageWithSha256 = eth.sha256(message)
  const extractedAddressWithSha256 = extractEthAddress(sig, messageWithSha256)
  if (extractedAddressWithSha256 === address) {
    return { isValid: true, invalidReason: null }
  }

  return { isValid: false, invalidReason: 'Signature is invalid' }
}

/**
 * Extract ethereum address from signature and message
 * @param {String} sig signed message with private key
 * @param {String} messageHash something hashed to sign
 * @returns {String}
 */
const extractEthAddress = (sig, messageHash) => {
  let sigParams = {}
  try {
    sigParams = eth.fromRpcSig(sig)
  } catch (err) {
    return ''
  }
  const msgHashBuffer = eth.toBuffer(messageHash)
  const pubKey = eth.ecrecover(msgHashBuffer, sigParams.v, sigParams.r, sigParams.s)
  const addressBuffer = eth.pubToAddress(pubKey, true)
  return eth.bufferToHex(addressBuffer)
}

/**
 * Check ethereum address format
 * @param {String} address
 * @returns {Bool}
 */
const isValidEthAddress = (address) => {
  if (!address) {
    return false
  }
  return web3._extend.utils.isAddress(address)
}

 module.exports = {
   validate,
   extractEthAddress,
   isValidEthAddress,
 }
