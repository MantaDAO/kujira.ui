import { AccountData, EncodeObject } from "@cosmjs/proto-signing";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { Keplr } from "./keplr";
import { Sonar } from "./sonar";
type Signer = Keplr | Sonar;
export declare class CW3Wallet {
    account: AccountData;
    signer: Signer;
    private constructor();
    static connect: (contract: string, signer: Signer) => Promise<CW3Wallet>;
    onChange: (fn: (k: CW3Wallet | null) => void) => void;
    disconnect: () => void;
    signAndBroadcast: (rpc: string, encodeObjects: EncodeObject[], gas: string, memo?: string, title?: string, description?: string) => Promise<DeliverTxResponse>;
}
export {};
