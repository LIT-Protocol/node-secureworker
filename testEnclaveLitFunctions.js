var SecureWorker = require('./lib/real.js')

var worker = new SecureWorker('enclave.so', 'enclave.js');
var sealedPrivateKey = null
var publicKey = null

worker.onMessage(function (message) {
  console.log('onMessage in host', JSON.stringify(message))
  switch (message.command) {
    case 'getSealedPrivateKey':
      sealedPrivateKey = message.sealedPrivateKey
      getPublicKey()
      break;
    case 'getPublicKey':
      publicKey = message.publicKey
    default:
      console.log('unknown command in host: ' + message.command)
  }
})

// test getting sealed private key
worker.postMessage({
  command: 'getSealedPrivateKey',
  ts: new Date().getTime()
})

function getPublicKey() {
  worker.postMessage({
    command: 'getPublicKey',
    ts: new Date().getTime()
  })
}