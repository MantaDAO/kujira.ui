import { ReactElement } from "react";
type OptionType<T> = {
    label: string;
    value: T;
    status?: string;
};
export type SelectProps<T> = {
    options: OptionType<T>[];
    selected?: OptionType<T>;
    onChange?: (e: any) => void;
    dark?: boolean;
    className?: string;
    allowCustomInput?: boolean;
    onCustomChange?: (e: any) => void;
    disabled?: boolean;
    suffix?: (t: OptionType<T>) => ReactElement;
    placeholder?: string;
};
export declare function Select<T>({ options, selected, onChange, dark, className, allowCustomInput, onCustomChange, disabled, suffix, placeholder, }: SelectProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
