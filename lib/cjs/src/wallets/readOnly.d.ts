import { AccountData, EncodeObject } from "@cosmjs/proto-signing";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { Denom } from "kujira.js";
export declare class ReadOnly {
    account: AccountData;
    private constructor();
    static connect: (address: string) => Promise<ReadOnly>;
    onChange: (fn: (k: ReadOnly | null) => void) => void;
    disconnect: () => void;
    signAndBroadcast: (rpc: string, msgs: EncodeObject[], gas: Denom, memo?: string) => Promise<DeliverTxResponse>;
}
