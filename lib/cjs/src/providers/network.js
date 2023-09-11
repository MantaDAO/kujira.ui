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
exports.useNetwork = exports.NetworkContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
const kujira_js_1 = require("kujira.js");
const react_1 = require("react");
const useLocalStorage_1 = require("../hooks/useLocalStorage");
const Context = (0, react_1.createContext)({
    network: kujira_js_1.MAINNET,
    setNetwork: () => { },
    tmClient: null,
    query: null,
    rpc: "",
    rpcs: [],
    setRpc: () => { },
    preferred: null,
    unlock: () => { },
    lock: () => { },
});
const toClient = (endpoint, setLatencies) => __awaiter(void 0, void 0, void 0, function* () {
    const start = new Date().getTime();
    const c = yield tendermint_rpc_1.Tendermint34Client.create(new tendermint_rpc_1.HttpBatchClient(endpoint, {
        dispatchInterval: 100,
        batchSizeLimit: 200,
    }));
    const status = yield c.status();
    setLatencies &&
        setLatencies((prev) => (Object.assign(Object.assign({}, prev), { [endpoint]: {
                latency: new Date().getTime() - start,
                latestBlockTime: new Date(status.syncInfo.latestBlockTime.toISOString()),
            } })));
    return [c, endpoint];
});
const NetworkContext = ({ children, onError }) => {
    const [network, setNetwork] = (0, useLocalStorage_1.useLocalStorage)("network", kujira_js_1.MAINNET);
    const [preferred, setPreferred] = (0, useLocalStorage_1.useLocalStorage)("rpc", "");
    const [tm, setTmClient] = (0, react_1.useState)();
    const [latencies, setLatencies] = (0, react_1.useState)({});
    const tmClient = tm && tm[0];
    (0, react_1.useEffect)(() => {
        if (preferred) {
            toClient(preferred)
                .then(setTmClient)
                .catch((err) => onError ? onError(err) : console.error(err));
        }
        else {
            Promise.any(kujira_js_1.RPCS[network].map((x) => toClient(x, setLatencies)))
                .then(setTmClient)
                .catch((err) => {
                setTmClient(null);
                onError ? onError(err) : console.error(err);
            });
        }
    }, [network]);
    const setRpc = (val) => {
        toClient(val)
            .then(setTmClient)
            .catch((err) => (onError ? onError(err) : console.error(err)));
    };
    const unlock = () => {
        setPreferred("");
    };
    const lock = () => {
        tm && setPreferred(tm[1]);
    };
    const query = (0, react_1.useMemo)(() => (tmClient ? (0, kujira_js_1.kujiraQueryClient)({ client: tmClient }) : null), [tmClient]);
    switch (tm) {
        case null:
            return ((0, jsx_runtime_1.jsx)(NoConnection, { network: network, setNetwork: setNetwork }));
        case undefined:
            return null;
        default:
            return ((0, jsx_runtime_1.jsx)(Context.Provider, Object.assign({ value: {
                    network,
                    setNetwork,
                    tmClient: tmClient || null,
                    query,
                    rpc: tm[1],
                    rpcs: Object.entries(latencies).map(([endpoint, data]) => (Object.assign({ endpoint }, data))),
                    setRpc,
                    unlock,
                    lock,
                    preferred: preferred || null,
                } }, { children: children }), network));
    }
};
exports.NetworkContext = NetworkContext;
const NoConnection = ({ network, setNetwork }) => {
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "px-2 py-10 md-flex ai-c jc-c dir-c wrap" }, { children: [(0, jsx_runtime_1.jsxs)("h1", Object.assign({ className: "fs-18" }, { children: ["No RPC connections available for ", network] })), (0, jsx_runtime_1.jsx)("h2", Object.assign({ className: "fs-16" }, { children: "Please check your internet connection" })), network !== kujira_js_1.MAINNET && ((0, jsx_runtime_1.jsx)("button", Object.assign({ className: "md-button mt-2", onClick: () => setNetwork(kujira_js_1.MAINNET) }, { children: "Switch to Mainnet" })))] })));
};
const useNetwork = () => {
    const { network, setNetwork, tmClient, query, rpc, setRpc, preferred, lock, unlock, rpcs, } = (0, react_1.useContext)(Context);
    return [
        {
            network,
            chainInfo: kujira_js_1.CHAIN_INFO[network],
            tmClient,
            query,
            rpc,
            rpcs,
            setRpc,
            preferred,
            lock,
            unlock,
        },
        setNetwork,
    ];
};
exports.useNetwork = useNetwork;
