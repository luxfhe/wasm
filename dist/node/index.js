var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/node.ts
import * as fs from "fs";
import * as path from "path";
var wasmInstance = null;
var goInstance = null;
var initPromise = null;
async function init() {
  if (wasmInstance) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const wasmExecPath = path.join(__dirname, "..", "wasm", "wasm_exec.js");
    __require(wasmExecPath);
    const go = new Go();
    goInstance = go;
    const wasmPath = path.join(__dirname, "..", "wasm", "luxfhe.wasm");
    const wasmBuffer = fs.readFileSync(wasmPath);
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    wasmInstance = await WebAssembly.instantiate(wasmModule, go.importObject);
    go.run(wasmInstance);
  })();
  return initPromise;
}
function getLuxFHE() {
  if (!wasmInstance) {
    throw new Error("FHE not initialized. Call init() first.");
  }
  return globalThis.luxfhe;
}
async function generateKeys() {
  await init();
  const fhe = getLuxFHE();
  return fhe.generateKeys();
}
async function encrypt(value, publicKey) {
  await init();
  const fhe = getLuxFHE();
  return fhe.encrypt(value, publicKey);
}
async function decrypt(ciphertext, privateKey) {
  await init();
  const fhe = getLuxFHE();
  return fhe.decrypt(ciphertext, privateKey);
}
function init_panic_hook() {
}
async function initThreadPool(numThreads) {
}
var TfheCompactPublicKey = class _TfheCompactPublicKey {
  key;
  constructor(key) {
    this.key = key || new Uint8Array();
  }
  static deserialize(bytes) {
    return new _TfheCompactPublicKey(bytes);
  }
  serialize() {
    return this.key;
  }
};
var CompactPkeCrs = class _CompactPkeCrs {
  static from_config(config, maxBits) {
    return new _CompactPkeCrs();
  }
};
var CompactPkePublicParams = class _CompactPkePublicParams {
  static new(crs, maxBits) {
    return new _CompactPkePublicParams();
  }
  static deserialize(bytes) {
    return new _CompactPkePublicParams();
  }
  serialize() {
    return new Uint8Array();
  }
};
var CompactCiphertextList = class _CompactCiphertextList {
  data;
  constructor(data) {
    this.data = data || new Uint8Array();
  }
  static builder(params) {
    return new CompactCiphertextListBuilder();
  }
  static deserialize(bytes) {
    return new _CompactCiphertextList(bytes);
  }
  serialize() {
    return this.data;
  }
};
var CompactCiphertextListBuilder = class {
  push(value) {
    return this;
  }
  build() {
    return new CompactCiphertextList();
  }
  build_with_proof_packed(key, load) {
    return {
      list: new CompactCiphertextList(),
      proof: new Uint8Array()
    };
  }
};
var ZkComputeLoad = /* @__PURE__ */ ((ZkComputeLoad2) => {
  ZkComputeLoad2["Proof"] = "Proof";
  ZkComputeLoad2["Verify"] = "Verify";
  return ZkComputeLoad2;
})(ZkComputeLoad || {});
async function initTFHE(options) {
  await init();
}
export {
  CompactCiphertextList,
  CompactCiphertextListBuilder,
  CompactPkeCrs,
  CompactPkePublicParams,
  TfheCompactPublicKey,
  ZkComputeLoad,
  decrypt,
  initTFHE as default,
  encrypt,
  generateKeys,
  getLuxFHE,
  init,
  initThreadPool,
  init_panic_hook
};
