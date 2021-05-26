(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

function toBase64(data) {
  if (typeof Duktape !== 'undefined') {
    return Duktape.enc('base64', new Buffer(data));
  } else {
    return Buffer.from(data).toString('base64');
  }
}

function fromBase64(string) {
  if (typeof Duktape !== 'undefined') {
    return new Uint8Array(Duktape.dec('base64', string)).buffer;
  } else {
    return new Uint8Array(Buffer.from(string, 'base64').values()).buffer;
  }
}

function getSealedPrivateKey() {
  console.log('getSealedPrivateKey()');
  var privateKey = crypto.getRandomValues(new Uint8Array(32));
  var sealed = SecureWorker.sealData(null, privateKey);
  return toBase64(sealed);
}

function getPublicKey(sealedPrivateKey) {
  console.log('getPublicKey');
  var privateKey = SecureWorker.unsealData(sealedPrivateKey);
}

SecureWorker.onMessage(function (message) {
  console.log('onMessage in enclave', JSON.stringify(message));
  var command = message.command;
  var ts = message.ts;
  switch (message.command) {
    case 'getSealedPrivateKey':
      var sealedPrivateKey = getSealedPrivateKey();
      SecureWorker.postMessage({
        command: command,
        ts: ts,
        sealedPrivateKey: sealedPrivateKey
      });
      break;
    case 'getPublicKey':
      var publicKey = getPublicKey(sealedPrivateKey);
    default:
      console.log('unknown command in enclave: ' + message.command);
  }
});

},{}]},{},[1]);
