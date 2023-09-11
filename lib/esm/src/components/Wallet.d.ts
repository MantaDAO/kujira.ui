import { IWallet } from "../providers/wallet";
export declare const NetworkWarning: () => import("react/jsx-runtime").JSX.Element;
export declare function Wallet({ adapter, }: {
    adapter?: () => Pick<IWallet, "adapter" | "balance" | "account" | "connect" | "disconnect" | "balances" | "chainInfo">;
}): import("react/jsx-runtime").JSX.Element;
export declare const Keplr: () => import("react/jsx-runtime").JSX.Element;
export declare const Sonar: () => import("react/jsx-runtime").JSX.Element;
export declare const Station: () => import("react/jsx-runtime").JSX.Element;
export declare const Leap: () => import("react/jsx-runtime").JSX.Element;
export declare const ReadOnly: () => import("react/jsx-runtime").JSX.Element;
export declare const XDefi: () => import("react/jsx-runtime").JSX.Element;
