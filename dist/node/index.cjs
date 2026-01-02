"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/node.ts
var node_exports = {};
__export(node_exports, {
  CompactCiphertextList: () => CompactCiphertextList,
  CompactCiphertextListBuilder: () => CompactCiphertextListBuilder,
  CompactPkeCrs: () => CompactPkeCrs,
  CompactPkePublicParams: () => CompactPkePublicParams,
  InitInput: () => InitInput,
  TfheCompactPublicKey: () => TfheCompactPublicKey,
  ZkComputeLoad: () => ZkComputeLoad,
  decrypt: () => decrypt,
  default: () => initTFHE,
  encrypt: () => encrypt,
  generateKeys: () => generateKeys,
  getLuxFHE: () => getLuxFHE,
  init: () => init,
  initThreadPool: () => initThreadPool,
  init_panic_hook: () => init_panic_hook
});
module.exports = __toCommonJS(node_exports);
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
var wasmInstance = null;
var goInstance = null;
var initPromise = null;
var InitInput = null;
async function init() {
  if (wasmInstance) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const wasmExecPath = path.join(__dirname, "..", "wasm", "wasm_exec.js");
    require(wasmExecPath);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CompactCiphertextList,
  CompactCiphertextListBuilder,
  CompactPkeCrs,
  CompactPkePublicParams,
  InitInput,
  TfheCompactPublicKey,
  ZkComputeLoad,
  decrypt,
  encrypt,
  generateKeys,
  getLuxFHE,
  init,
  initThreadPool,
  init_panic_hook
});
