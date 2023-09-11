import { FC, PropsWithChildren } from "react";
export declare const Modal: FC<PropsWithChildren<{
    show: boolean;
    close: () => void;
    title?: string;
    confirm?: () => void;
    large?: boolean;
    backgroundClose?: boolean;
    className?: string;
}>>;
