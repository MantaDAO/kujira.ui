import { createElement } from "react";
import ar from "../../i18n/translations/ar-AE.json";
import de from "../../i18n/translations/de-DE.json";
import es from "../../i18n/translations/es-ES.json";
import it from "../../i18n/translations/it-IT.json";
import ru from "../../i18n/translations/ru-RU.json";
import template from "../../i18n/translations/template.json";
import tr from "../../i18n/translations/tr-TR.json";
const replace = (string, replacements) => {
    const r = replacements.pop();
    if (r) {
        return replace(string.replace("{}", r), replacements);
    }
    else {
        return string;
    }
};
export const t = (string, replacements = []) => {
    const lang = navigator.language;
    const txs = translations(lang);
    if (txs) {
        const tx = replace(txs[string], replacements.reverse());
        if (!tx)
            txs[string] = "";
        return tx || string;
    }
    return string;
};
const translations = (language) => {
    switch (language) {
        case "de":
        case "de-DE":
            return de;
        case "tr":
        case "tr-TR":
            return tr;
        case "es":
        case "es-ES":
            return es;
        case "it":
        case "it-IT":
            return it;
        case "ru":
        case "ru-RU":
            return ru;
        case "ar":
        case "ar-AE":
        case "ar-BH":
        case "ar-DZ":
        case "ar-EG":
        case "ar-IQ":
        case "ar-JO":
        case "ar-KW":
        case "ar-LB":
        case "ar-LY":
        case "ar-MA":
        case "ar-OM":
        case "ar-QA":
        case "ar-SA":
        case "ar-SY":
        case "ar-TN":
        case "ar-YE":
            return ar;
        default:
            return template;
    }
};
const comp = (tag) => (props) => createElement(tag, props, typeof props.children === "string"
    ? t(props.children)
    : props.children);
export const a = comp("a");
export const strong = comp("strong");
export const label = comp("label");
export const li = comp("li");
export const h1 = comp("h1");
export const h2 = comp("h2");
export const h3 = comp("h3");
export const h4 = comp("h4");
export const th = comp("th");
export const td = comp("td");
export const div = comp("div");
export const span = comp("span");
export const small = comp("small");
export const p = comp("p");
export const button = comp("button");
document.onkeyup = function (e) {
    if (e.ctrlKey && e.shiftKey && e.key == "E") {
        const lang = navigator.language;
        const txs = translations(lang);
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(txs, null, 2)], {
            type: "application/json",
        });
        a.href = URL.createObjectURL(file);
        a.download = `${lang}.json`;
        a.click();
    }
};
