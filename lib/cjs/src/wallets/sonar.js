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
exports.Sonar = void 0;
const stargate_1 = require("@cosmjs/stargate");
const sign_client_1 = require("@walletconnect/sign-client");
const kujira_js_1 = require("kujira.js");
const requiredNamespaces = {
    cosmos: {
        chains: ["cosmos:kaiyo-1"],
        methods: [],
        events: [],
    },
};
// https://docs.walletconnect.com/2.0/javascript/sign/dapp-usage
class Sonar {
    constructor(connector, session) {
        this.connector = connector;
        this.session = session;
        this.onChange = (fn) => {
            this.connector.on("session_delete", () => {
                fn(null);
            });
        };
        this.disconnect = () => {
            this.connector.disconnect({
                topic: this.session.topic,
                reason: { code: 1, message: "USER_CLOSED" },
            });
        };
        this.signAndBroadcast = (rpc, msgs, feeDenom, memo) => __awaiter(this, void 0, void 0, function* () {
            const bytes = yield this.connector.request({
                topic: this.session.topic,
                chainId: "cosmos:kaiyo-1",
                request: {
                    method: this.session.namespaces["cosmos"].methods[0],
                    params: {
                        feeDenom,
                        memo,
                        msgs: msgs
                            .map((m) => kujira_js_1.registry.encodeAsAny(m))
                            .map((x) => (Object.assign(Object.assign({}, x), { value: Buffer.from(x.value).toString("base64") }))),
                    },
                },
            });
            const client = yield stargate_1.StargateClient.connect(rpc);
            const res = yield client.broadcastTx(Buffer.from(bytes, "base64"));
            (0, stargate_1.assertIsDeliverTxSuccess)(res);
            return res;
        });
        const [account] = session.namespaces["cosmos"].accounts.map((address) => ({
            address: address.split(":")[2],
            pubkey: new Uint8Array(),
            algo: "secp256k1",
        }));
        this.account = account;
    }
}
_a = Sonar;
Sonar.connect = (network = kujira_js_1.MAINNET, options) => __awaiter(void 0, void 0, void 0, function* () {
    const signClient = yield sign_client_1.SignClient.init({
        projectId: "fbda64846118d1a3487a4bfe3a6b00ac",
    });
    const lastSession = signClient
        .find({
        requiredNamespaces,
    })
        .at(-1);
    if (lastSession)
        return new Sonar(signClient, lastSession);
    const { uri, approval } = yield signClient.connect({
        requiredNamespaces,
        optionalNamespaces: {
            cosmos: {
                chains: [],
                methods: ["cosmos_signDirect", "cosmos_signAmino"],
                events: [],
            },
        },
    });
    uri && options.request(uri);
    const session = yield approval();
    return new Sonar(signClient, session);
});
exports.Sonar = Sonar;
