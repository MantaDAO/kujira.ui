var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HttpBatchClient, Tendermint34Client, } from "@cosmjs/tendermint-rpc";
import { CHAIN_INFO, kujiraQueryClient, MAINNET, RPCS, } from "kujira.js";
import { createContext, useContext, useEffect, useMemo, useState, } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
const Context = createContext({
    network: MAINNET,
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
    const c = yield Tendermint34Client.create(new HttpBatchClient(endpoint, {
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
export const NetworkContext = ({ children, onError }) => {
    const [network, setNetwork] = useLocalStorage("network", MAINNET);
    const [preferred, setPreferred] = useLocalStorage("rpc", "");
    const [tm, setTmClient] = useState();
    const [latencies, setLatencies] = useState({});
    const tmClient = tm && tm[0];
    useEffect(() => {
        if (preferred) {
            toClient(preferred)
                .then(setTmClient)
                .catch((err) => onError ? onError(err) : console.error(err));
        }
        else {
            Promise.any(RPCS[network].map((x) => toClient(x, setLatencies)))
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
    const query = useMemo(() => (tmClient ? kujiraQueryClient({ client: tmClient }) : null), [tmClient]);
    switch (tm) {
        case null:
            return (_jsx(NoConnection, { network: network, setNetwork: setNetwork }));
        case undefined:
            return null;
        default:
            return (_jsx(Context.Provider, { value: {
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
                }, children: children }, network));
    }
};
const NoConnection = ({ network, setNetwork }) => {
    return (_jsxs("div", { className: "px-2 py-10 md-flex ai-c jc-c dir-c wrap", children: [_jsxs("h1", { className: "fs-18", children: ["No RPC connections available for ", network] }), _jsx("h2", { className: "fs-16", children: "Please check your internet connection" }), network !== MAINNET && (_jsx("button", { className: "md-button mt-2", onClick: () => setNetwork(MAINNET), children: "Switch to Mainnet" }))] }));
};
export const useNetwork = () => {
    const { network, setNetwork, tmClient, query, rpc, setRpc, preferred, lock, unlock, rpcs, } = useContext(Context);
    return [
        {
            network,
            chainInfo: CHAIN_INFO[network],
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
