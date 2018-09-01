const {blake2b} = require('blakejs')
const bs58 = require('bs58')

function ss58_decode(address) {
	let a
	try {
		a = bs58.decode(address)
	}
	catch (e) {
		return null
	}
	if (a[0] == 42) {
		if (a.length == 32 + 1 + 2) {
			let address = a.slice(0, 33)
			let hash = blake2b(address)
			if (a[33] == hash[0] && a[34] == hash[1]) {
				return address.slice(1)
			} else {
				// invalid checksum
				return null
			}
		} else {
			// Invalid length.
			return null
		}
	} else {
		// Invalid version.
		return null
	}
}

function ss58_encode(address) {
	if (address.length != 32) {
		return null
	}
	let bytes = new Uint8Array([42, ...address])
	let hash = blake2b(bytes)
	let complete = new Uint8Array([...bytes, hash[0], hash[1]])
	return bs58.encode(complete)
}

module.exports = { ss58_decode, ss58_encode }