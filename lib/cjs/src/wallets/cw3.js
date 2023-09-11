"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CW3Wallet = void 0;
const kujira_js_1 = require("kujira.js");
const toCosmosMsg = (encodeObject) => ({});
class CW3Wallet {
    constructor(account, signer) {
        this.account = account;
        this.signer = signer;
        this.onChange = (fn) => { };
        this.disconnect = () => { };
        this.signAndBroadcast = (rpc, encodeObjects, gas, memo, title, description) => __awaiter(this, void 0, void 0, function* () {
            const msgs = [
                kujira_js_1.msg.wasm.msgExecuteContract({
                    sender: this.signer.account.address,
                    contract: this.account.address,
                    msg: Buffer.from(JSON.stringify({
                        propose: {
                            title,
                            description,
                            msgs: encodeObjects.map(toCosmosMsg),
                        },
                    })),
                    funds: [],
                }),
            ];
            return this.signer.signAndBroadcast(rpc, msgs, gas, memo);
        });
    }
}
_a = CW3Wallet;
CW3Wallet.connect = (contract, signer) => __awaiter(void 0, void 0, void 0, function* () {
    return new CW3Wallet({
        address: contract,
        algo: "secp256k1",
        pubkey: new Uint8Array(),
    }, signer);
});
exports.CW3Wallet = CW3Wallet;
