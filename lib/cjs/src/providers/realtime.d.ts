import { NETWORK } from "kujira.js";
import { Channel } from "phoenix";
import { PropsWithChildren } from "react";
export declare const RealtimeContext: React.FC<PropsWithChildren<{
    network: NETWORK;
}>>;
export declare const useChannel: (topic: string) => Channel | undefined;
