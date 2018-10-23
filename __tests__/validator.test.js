const validator = require('../validator')
const eth = require('ethereumjs-util')
const Web3 = require('web3')
const web3 = new Web3()

test('validate', () => {
  const message = 'test'
  const sigWithSha3 = '0x9e9d9caa1f4c89cd0df29b56d89d7f89279104bb80d0f994396d188889a6ffdc1a07bb214acd6101152e90768c49a3120978075fdf7ed43bd35e9931594448461b'
  const sigWithSha256 = '0x7eded7d8fd9bcea7ee31ddb6843b3b6806ce099694150f824d87689f452de3661bcbda3070861026795cfd91ecdfe0244e58f63b2bc9c9aae928056a5a21b6691b'
  const ethereumAddress = '0xe0bdf5ac185d88ffe01d0b9438289f8c256e4e93'
  const ethereumAddressCaseMixed = '0xe0bdf5Ac185d88FFE01d0b9438289f8c256E4e93';

  expect(validator.validate(sigWithSha3, message, ethereumAddress)).toEqual({ isValid: true, invalidReason: null })
  expect(validator.validate(sigWithSha3, message, ethereumAddressCaseMixed)).toEqual({ isValid: true, invalidReason: null })
  expect(validator.validate(sigWithSha256, message, ethereumAddress)).toEqual({ isValid: true, invalidReason: null })
  expect(validator.validate(sigWithSha256, message, ethereumAddressCaseMixed)).toEqual({ isValid: true, invalidReason: null })
  expect(validator.validate(sigWithSha256, '', ethereumAddress)).toEqual({ isValid: false, invalidReason: 'Signature is invalid' })
  expect(validator.validate('', message, ethereumAddress)).toEqual({ isValid: false, invalidReason: 'Signature is invalid' })
  expect(validator.validate(`${sigWithSha256.replace('a', 'b')}`, message, ethereumAddress)).toEqual({ isValid: false, invalidReason: 'Signature is invalid' })
  expect(validator.validate(sigWithSha256, message, `${ethereumAddress}a`)).toEqual({ isValid: false, invalidReason: 'Ethereum address is invalid' })
})

test('extractEthAddress', () => {
  const message = 'test'
  const sigWithSha3 = '0x9e9d9caa1f4c89cd0df29b56d89d7f89279104bb80d0f994396d188889a6ffdc1a07bb214acd6101152e90768c49a3120978075fdf7ed43bd35e9931594448461b'
  const sigWithSha256 = '0x7eded7d8fd9bcea7ee31ddb6843b3b6806ce099694150f824d87689f452de3661bcbda3070861026795cfd91ecdfe0244e58f63b2bc9c9aae928056a5a21b6691b'
  const ethereumAddress = '0xe0bdf5ac185d88ffe01d0b9438289f8c256e4e93'

  expect(validator.extractEthAddress(sigWithSha3, web3.sha3(message))).toEqual(ethereumAddress)
  expect(validator.extractEthAddress(sigWithSha256, eth.sha256(message))).toEqual(ethereumAddress)
  expect(validator.extractEthAddress(sigWithSha3, web3.sha3(`${message.replace('t', 'a')}`))).not.toEqual(ethereumAddress)
  expect(validator.extractEthAddress(sigWithSha256, eth.sha256(`${message.replace('t', 'a')}`))).not.toEqual(ethereumAddress)
})

test('isValidEthAddress', () => {
  // with 0x
  expect(validator.isValidEthAddress('0x39193570edd8de6c328cd59849fcb90ce9c45e1f')).toBeTruthy

  // without 0x
  expect(validator.isValidEthAddress('39193570edd8de6c328cd59849fcb90ce9c45e1f')).toBeTruthy

  // digit shortage
  expect(validator.isValidEthAddress('0x39193570edd8de6c328cd59849fcb90ce9c45e1')).toBeFalsy

  // digit overflow
  expect(validator.isValidEthAddress('0x39193570edd8de6c328cd59849fcb90ce9c45e1f1')).toBeFalsy

  // contains not hex character
  expect(validator.isValidEthAddress('0x39193570edd8de6c328cd59849fcb90ce9c45e1fx')).toBeFalsy
})
