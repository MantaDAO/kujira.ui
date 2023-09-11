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
import { accountParser, aminoTypes, registry } from "kujira.js";
import * as evmos from "./evmos";
export class Leap {
    constructor(account, config, options) {
        this.account = account;
        this.config = config;
        this.options = options;
        this.onChange = (fn) => {
            window.addEventListener("leap_keystorechange", () => {
                const leap = window.leap;
                if (!leap)
                    return;
                leap
                    .getOfflineSignerAuto(this.config.chainId)
                    .then((signer) => signer.getAccounts())
                    .then((as) => {
                    if (as.length) {
                        this.account = as[0];
                        fn(this);
                    }
                });
            });
        };
        this.disconnect = () => { };
        this.signAndBroadcast = (rpc, msgs
        // batch?: {
        //   size: number;
        //   cb: (total: number, remaining: number) => void;
        // }
        ) => __awaiter(this, void 0, void 0, function* () {
            if (!window.leap)
                throw new Error("No Wallet Connected");
            const signer = yield window.leap.getOfflineSignerAuto(this.config.chainId);
            if (this.config.chainName === "Evmos")
                return evmos.signAndBroadcast({
                    rpc: this.config.rpc,
                    signer,
                    messages: msgs,
                    sourceAccount: this.account,
                    sourceChainData: this.config,
                });
            const gasPrice = new GasPrice(Decimal.fromUserInput("0.00125", 18), this.options
                ? this.options.feeDenom
                : this.config.feeCurrencies[0].coinDenom);
            const client = yield SigningStargateClient.connectWithSigner(rpc, signer, {
                registry,
                gasPrice,
                aminoTypes: aminoTypes(this.config.bech32Config.bech32PrefixAccAddr),
                accountParser,
            });
            // if (batch) {
            //   const chunks = msgs.reduce((agg, item, index) => {
            //     const chunkIndex = Math.floor(index / batch.size);
            //     if (!agg[chunkIndex]) agg[chunkIndex] = [];
            //     agg[chunkIndex].push(item);
            //     return agg;
            //   }, [] as EncodeObject[][]);
            //   let remaining = chunks.length;
            //   batch.cb(chunks.length, remaining);
            //   let res: DeliverTxResponse;
            //   for (const chunk of chunks) {
            //     res = await client.signAndBroadcast(
            //       this.account.address,
            //       chunk,
            //       1.5
            //     );
            //     remaining -= 1;
            //     batch.cb(chunks.length, remaining);
            //   }
            //   // @ts-expect-error this is fine
            //   return res;
            // } else {
            return yield client.signAndBroadcast(this.account.address, msgs, 1.5);
            // }
        });
    }
}
Leap.connect = (config, opts) => {
    const leap = window.leap;
    if (!leap)
        throw new Error("Leap extension not available");
    return leap
        .experimentalSuggestChain(config)
        .then(() => leap.enable(config.chainId))
        .then(() => leap.getOfflineSignerAuto(config.chainId))
        .then((signer) => signer.getAccounts())
        .then((as) => {
        if (as.length) {
            return new Leap(as[0], config, opts);
        }
        else {
            throw new Error("No Accounts");
        }
    });
};
