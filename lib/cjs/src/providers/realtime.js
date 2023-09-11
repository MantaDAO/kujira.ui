"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChannel = exports.RealtimeContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const kujira_js_1 = require("kujira.js");
const phoenix_1 = require("phoenix");
const react_1 = require("react");
const Context = (0, react_1.createContext)({
    socket: null,
    channels: {},
    addChannel: () => { },
});
const RealtimeContext = ({ children, network }) => {
    const [socket, setSocket] = (0, react_1.useState)(null);
    const [channels, setChannels] = (0, react_1.useState)({});
    const addChannel = (topic) => setChannels((prev) => {
        if (prev[topic])
            return prev;
        if (!socket)
            return prev;
        const c = socket.channel(topic);
        c.join();
        return Object.assign(Object.assign({}, prev), { [topic]: c });
    });
    (0, react_1.useEffect)(() => {
        const endpoint = {
            [kujira_js_1.LOCALNET]: "ws://localhost:4000",
            [kujira_js_1.TESTNET]: "wss://api-harpoon.kujira.app",
            [kujira_js_1.MAINNET]: "wss://api.kujira.app",
        }[network];
        if ((socket === null || socket === void 0 ? void 0 : socket.endPointURL()) === endpoint)
            return;
        socket === null || socket === void 0 ? void 0 : socket.disconnect();
        setChannels({});
        const s = new phoenix_1.Socket(`${endpoint}/socket`);
        s.connect();
        setSocket(s);
        return () => socket === null || socket === void 0 ? void 0 : socket.disconnect();
    }, [network]);
    return ((0, jsx_runtime_1.jsx)(Context.Provider, Object.assign({ value: { socket, channels, addChannel } }, { children: children })));
};
exports.RealtimeContext = RealtimeContext;
const useChannel = (topic) => {
    const { socket, channels, addChannel } = (0, react_1.useContext)(Context);
    const channel = channels[topic];
    (0, react_1.useEffect)(() => {
        if (!socket)
            return;
        addChannel(topic);
    }, [socket]);
    return channel;
};
exports.useChannel = useChannel;
