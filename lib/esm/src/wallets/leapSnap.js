var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Decimal } from "@cosmjs/math";
import { GasPrice, SigningStargateClient, } from "@cosmjs/stargate";
import { CosmjsOfflineSigner, connectSnap, getKey, getSnap, suggestChain, } from "@leapwallet/cosmos-snap-provider";
import { accountParser, aminoTypes, registry } from "kujira.js";
export class LeapSnap {
    constructor(account, config, options) {
        this.account = account;
        this.config = config;
        this.options = options;
        this.onChange = (fn) => { };
        this.disconnect = () => { };
        this.signAndBroadcast = (rpc, encodeObjects) => __awaiter(this, void 0, void 0, function* () {
            const signer = new CosmjsOfflineSigner(this.config.chainId);
            const gasPrice = new GasPrice(Decimal.fromUserInput("0.00125", 18), this.options
                ? this.options.feeDenom
                : this.config.feeCurrencies[0].coinDenom);
            const client = yield SigningStargateClient.connectWithSigner(rpc, signer, {
                registry,
                gasPrice,
                aminoTypes: aminoTypes(this.config.bech32Config.bech32PrefixAccAddr),
                accountParser,
            });
            return yield client.signAndBroadcast(this.account.address, encodeObjects, 1.5);
        });
    }
    static connect(config, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapInstalled = yield getSnap();
            if (!snapInstalled) {
                yield connectSnap(); // Initiates installation if not already present
            }
            try {
                const account = yield getKey(config.chainId);
                return new LeapSnap(account, config, opts);
            }
            catch (error) {
                if (error.message === "Invalid chainId") {
                    yield suggestChain(config);
                    return LeapSnap.connect(config, opts);
                }
                throw error;
            }
        });
    }
}
