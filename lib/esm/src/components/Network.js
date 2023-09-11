import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { LOCALNET, MAINNET, NETWORKS, TESTNET } from "kujira.js";
import { useEffect, useState } from "react";
import { useNetwork } from "../providers/network";
import { useChannel } from "../providers/realtime";
import { Select } from "./Select";
const status = (latency) => latency > 2000 ? "red" : latency > 750 ? "orange" : "green";
export const Network = () => {
    var _a;
    // return null;
    // TODO: Move realtime into kujira.ui
    const [{ rpcs, rpc, setRpc, preferred, lock, unlock, tmClient }] = useNetwork();
    const locked = !!preferred;
    const latency = ((_a = rpcs.find((r) => r.endpoint === rpc)) === null || _a === void 0 ? void 0 : _a.latency) || 0;
    const [blockTime, setBlockTime] = useState(null);
    const [lag, setLag] = useState(10000);
    const [block, setBlock] = useState();
    const blockChannel = useChannel("block:all");
    useEffect(() => {
        blockChannel === null || blockChannel === void 0 ? void 0 : blockChannel.on("new_block", ({ body }) => {
            setBlock({ height: body.height });
        });
        return blockChannel === null || blockChannel === void 0 ? void 0 : blockChannel.off("new_block");
    }, [blockChannel]);
    useEffect(() => {
        tmClient === null || tmClient === void 0 ? void 0 : tmClient.block().then(({ block }) => {
            var _a;
            if (!((_a = block === null || block === void 0 ? void 0 : block.header) === null || _a === void 0 ? void 0 : _a.height))
                return;
            const height = block.header.height;
            setBlock({
                height: block.header.height,
            });
            const diff = new Date().getTime() - block.header.time.getTime();
            setLag(diff);
            tmClient === null || tmClient === void 0 ? void 0 : tmClient.block(height - 1000).then(({ block }) => {
                var _a;
                if (!((_a = block === null || block === void 0 ? void 0 : block.header) === null || _a === void 0 ? void 0 : _a.time))
                    return;
                const time = block.header.time;
                const diff = new Date().getTime() - time.getTime();
                setBlockTime(diff / 1000);
            });
        });
    }, [tmClient]);
    return (_jsxs("div", Object.assign({ className: "rpc" }, { children: [_jsx("span", { children: "Connected to" }), _jsx(NetworkSelect, {}), _jsx("span", { children: "with" }), _jsx(Select, { className: "select--small select--mono select--align-start", options: rpcs
                    .sort((a, b) => b.latency - a.latency)
                    .map((e) => ({
                    label: `${e.endpoint}`,
                    value: e.endpoint,
                    status: status(e.latency),
                })), selected: {
                    label: rpc || "",
                    value: rpc || "",
                    status: status(latency),
                }, disabled: locked, allowCustomInput: true, onCustomChange: (v) => setRpc(v), onChange: (v) => setRpc(v), suffix: (v) => {
                    var _a, _b;
                    return (_jsxs("small", Object.assign({ className: "color-lightGrey ml-q1" }, { children: ["(", ((_a = rpcs.find((r) => r.endpoint === v.value)) === null || _a === void 0 ? void 0 : _a.latency) || 0, "ms,", " ", (_b = rpcs
                                .find((r) => r.endpoint === v.value)) === null || _b === void 0 ? void 0 : _b.latestBlockTime.toLocaleString(), ")"] })));
                } }), locked ? (_jsx("svg", Object.assign({ xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 382 382", onClick: unlock }, { children: _jsx("path", { fill: "#60fbd0", d: "M381.45 141.14a41.506 41.506 0 0 1-18.199 30.801l-73.922 49.84-16.238 67.48a41.962 41.962 0 0 1-10.688 19.297 41.962 41.962 0 0 1-18.992 11.223 39.007 39.007 0 0 1-11.48 1.398 41.11 41.11 0 0 1-29.398-12.316l-129.36-129.36v-.004a41.277 41.277 0 0 1-11.094-18.934 41.31 41.31 0 0 1 .172-21.945 41.98 41.98 0 0 1 11.223-18.992A41.969 41.969 0 0 1 92.77 108.94l67.48-16.238 49.84-73.922A41.515 41.515 0 0 1 240.89.581a40.714 40.714 0 0 1 33.599 12.04l94.922 94.921a41.291 41.291 0 0 1 12.039 33.598h-.001ZM4.57 357.86v.004a14.001 14.001 0 0 0 9.8 23.798 13.133 13.133 0 0 0 9.801-4.2l103.6-103.6-19.602-19.598L4.57 357.86Z" }) }))) : (_jsx("svg", Object.assign({ xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 382 382", onClick: lock }, { children: _jsx("path", { fill: "currentColor", d: "M336.65 316.98a13.545 13.545 0 0 1 4.2 9.8c0 3.704-1.52 7.247-4.2 9.802a13.53 13.53 0 0 1-9.8 4.199 13.53 13.53 0 0 1-9.802-4.2l-44.8-44.8a41.884 41.884 0 0 1-28.84 28 39.01 39.01 0 0 1-11.48 1.402 41.14 41.14 0 0 1-29.399-12.32L73.17 179.503a41.31 41.31 0 0 1-10.922-40.883 41.891 41.891 0 0 1 28-28.84l-44.8-44.801h.003A13.858 13.858 0 1 1 65.048 45.38l215.04 215.04 56.562 56.559ZM4.57 357.859l-.004.004c-3.918 4-5.078 9.95-2.945 15.129a14.007 14.007 0 0 0 12.746 8.673 13.136 13.136 0 0 0 9.8-4.204l103.6-103.6-19.601-19.598L4.57 357.859Zm364.84-250.32-94.922-94.922v.004A40.73 40.73 0 0 0 240.89.58a41.518 41.518 0 0 0-30.801 18.2l-49.84 73.922-6.441 1.68 133.84 133.84 1.68-6.442 73.921-49.84a42.05 42.05 0 0 0 18.195-30.754 42.076 42.076 0 0 0-12.035-33.648h.001Z" }) }))), _jsxs("div", Object.assign({ className: "status" }, { children: [_jsx("i", { className: status(lag / 7.5) }), _jsx("span", { children: "Block height" }), _jsx("span", Object.assign({ className: "color-white ml-q1" }, { children: block && block.height.toLocaleString() })), _jsx("span", Object.assign({ className: "ml-1" }, { children: "Block speed" })), _jsxs("span", Object.assign({ className: "color-white ml-q1" }, { children: [Math.round(blockTime || 0).toLocaleString(), "ms"] }))] }))] })));
};
const names = {
    [TESTNET]: "testnet",
    [MAINNET]: "mainnet",
    [LOCALNET]: "local",
};
const NetworkSelect = () => {
    const [{ network }, setNetwork] = useNetwork();
    return (_jsx(_Fragment, { children: Object.entries(NETWORKS).length > 1 && (_jsx(Select, { className: "select--small select--mono select--align-start mr-1", selected: {
                label: `${names[network]} (${network})`,
                value: network,
            }, onChange: setNetwork, options: [
                { label: "Mainnet", value: MAINNET },
                { label: "Testnet", value: TESTNET },
                { label: "Local", value: LOCALNET },
            ] })) }));
};
