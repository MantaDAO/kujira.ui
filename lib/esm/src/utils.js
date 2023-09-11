import { Denom } from "kujira.js";
export const coinSort = (a, b) => parseInt(b.amount || "") /
    Math.pow(10, Denom.from(b.denom || "").decimals) -
    parseInt(a.amount || "") / Math.pow(10, Denom.from(a.denom || "").decimals);
export const appLink = (app) => {
    const domain = window.location.host.split(".").slice(-2).join(".");
    return "https://" + app + (app === "" ? "" : ".") + domain;
};
