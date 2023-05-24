const bls = require('bls-lib')
bls.onModuleInit(() => {
  bls.init()

  const sec = bls.secretKey()
  const pub = bls.publicKey()
  const sig = bls.signature()

  bls.secretKeySetByCSPRNG(sec)
  const msg = 'cross'
  bls.sign(sig, sec, msg)

  bls.getPublicKey(pub, sec)

  const v = bls.verify(sig, pub, msg)
  // v === true

  bls.free(sec)
  bls.free(sig)
  bls.free(pub)
})