
function toBase64(data) {
  if (typeof Duktape !== 'undefined') {
    return Duktape.enc('base64', new Buffer(data));
  }
  else {
    return Buffer.from(data).toString('base64');
  }
}

function fromBase64(string) {
  if (typeof Duktape !== 'undefined') {
    return new Uint8Array(Duktape.dec('base64', string)).buffer;
  }
  else {
    return new Uint8Array(Buffer.from(string, 'base64').values()).buffer;
  }
}

function getSealedPrivateKey() {
  console.log('getSealedPrivateKey()')
  const privateKey = crypto.getRandomValues(new Uint8Array(32))
  const sealed = SecureWorker.sealData(null, privateKey)
  return toBase64(sealed)
}

function getPublicKey(sealedPrivateKey) {
  console.log('getPublicKey')
  const privateKey = SecureWorker.unsealData(fromBase64(sealedPrivateKey))
  console.log('unsealed')

  return 0
}

SecureWorker.onMessage(function (message) {
  console.log('onMessage in enclave', JSON.stringify(message))
  const command = message.command
  const ts = message.ts
  switch (message.command) {
    case 'getSealedPrivateKey':
      const sealedPrivateKey = getSealedPrivateKey()
      SecureWorker.postMessage({
        command: command,
        ts: ts,
        sealedPrivateKey: sealedPrivateKey
      })
      break;
    case 'getPublicKey':
      const publicKey = getPublicKey(message.sealedPrivateKey)
      break;
    default:
      console.log('unknown command in enclave: ' + message.command)
  }
})