import { jsx as _jsx } from "react/jsx-runtime";
import { LOCALNET, MAINNET, TESTNET } from "kujira.js";
import { Socket } from "phoenix";
import { createContext, useContext, useEffect, useState, } from "react";
const Context = createContext({
    socket: null,
    channels: {},
    addChannel: () => { },
});
export const RealtimeContext = ({ children, network }) => {
    const [socket, setSocket] = useState(null);
    const [channels, setChannels] = useState({});
    const addChannel = (topic) => setChannels((prev) => {
        if (prev[topic])
            return prev;
        if (!socket)
            return prev;
        const c = socket.channel(topic);
        c.join();
        return Object.assign(Object.assign({}, prev), { [topic]: c });
    });
    useEffect(() => {
        const endpoint = {
            [LOCALNET]: "ws://localhost:4000",
            [TESTNET]: "wss://api-harpoon.kujira.app",
            [MAINNET]: "wss://api.kujira.app",
        }[network];
        if ((socket === null || socket === void 0 ? void 0 : socket.endPointURL()) === endpoint)
            return;
        socket === null || socket === void 0 ? void 0 : socket.disconnect();
        setChannels({});
        const s = new Socket(`${endpoint}/socket`);
        s.connect();
        setSocket(s);
        return () => socket === null || socket === void 0 ? void 0 : socket.disconnect();
    }, [network]);
    return (_jsx(Context.Provider, Object.assign({ value: { socket, channels, addChannel } }, { children: children })));
};
export const useChannel = (topic) => {
    const { socket, channels, addChannel } = useContext(Context);
    const channel = channels[topic];
    useEffect(() => {
        if (!socket)
            return;
        addChannel(topic);
    }, [socket]);
    return channel;
};
