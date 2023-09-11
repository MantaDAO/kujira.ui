import { IWallet } from "../providers/wallet";
export declare const NetworkWarning: () => any;
export declare function Wallet({ adapter, }: {
    adapter?: () => Pick<IWallet, "adapter" | "balance" | "account" | "connect" | "disconnect" | "balances" | "chainInfo">;
}): any;
export declare const Keplr: () => any;
export declare const Sonar: () => any;
export declare const Station: () => any;
export declare const Leap: () => any;
export declare const ReadOnly: () => any;
export declare const XDefi: () => any;
