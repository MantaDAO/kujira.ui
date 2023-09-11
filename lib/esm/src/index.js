import "./number";
export * as components from "./components";
export * as hooks from "./hooks";
export * as i18n from "./i18n";
export * as icons from "./icons";
export * as providers from "./providers";
export * from "./utils";
export * from "./wallets";
Number.prototype.toLocaleDecimal = function (decimals = 0) {
    return this.toLocaleString(undefined, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
    });
};
Array.prototype.uniqueBy = function (fn) {
    return this.reduce((a, v, idx, arr) => arr.slice(0, idx).find((x) => fn(x) === fn(v)) ? a : [...a, v], []);
};
