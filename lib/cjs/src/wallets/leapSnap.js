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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeapSnap = void 0;
const math_1 = require("@cosmjs/math");
const stargate_1 = require("@cosmjs/stargate");
const cosmos_snap_provider_1 = require("@leapwallet/cosmos-snap-provider");
const kujira_js_1 = require("kujira.js");
class LeapSnap {
    constructor(account, config, options) {
        this.account = account;
        this.config = config;
        this.options = options;
        this.onChange = (fn) => { };
        this.disconnect = () => { };
        this.signAndBroadcast = (rpc, encodeObjects) => __awaiter(this, void 0, void 0, function* () {
            const signer = new cosmos_snap_provider_1.CosmjsOfflineSigner(this.config.chainId);
            const gasPrice = new stargate_1.GasPrice(math_1.Decimal.fromUserInput("0.00125", 18), this.options
                ? this.options.feeDenom
                : this.config.feeCurrencies[0].coinDenom);
            const client = yield stargate_1.SigningStargateClient.connectWithSigner(rpc, signer, {
                registry: kujira_js_1.registry,
                gasPrice,
                aminoTypes: (0, kujira_js_1.aminoTypes)(this.config.bech32Config.bech32PrefixAccAddr),
                accountParser: kujira_js_1.accountParser,
            });
            return yield client.signAndBroadcast(this.account.address, encodeObjects, 1.5);
        });
    }
    static connect(config, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapInstalled = yield (0, cosmos_snap_provider_1.getSnap)();
            if (!snapInstalled) {
                yield (0, cosmos_snap_provider_1.connectSnap)(); // Initiates installation if not already present
            }
            try {
                const account = yield (0, cosmos_snap_provider_1.getKey)(config.chainId);
                return new LeapSnap(account, config, opts);
            }
            catch (error) {
                if (error.message === "Invalid chainId") {
                    yield (0, cosmos_snap_provider_1.suggestChain)(config);
                    return LeapSnap.connect(config, opts);
                }
                throw error;
            }
        });
    }
}
exports.LeapSnap = LeapSnap;
