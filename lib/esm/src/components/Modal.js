import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import clsx from "clsx";
import ReactDOM from "react-dom";
import { IconClose } from "../icons/IconClose";
export const Modal = ({ show, close, title, confirm, large, backgroundClose = true, className, children, }) => {
    const dest = document.getElementById("modal");
    return dest
        ? ReactDOM.createPortal(_jsx(_Fragment, { children: show ? (_jsx("div", { className: clsx({
                    modal: true,
                    "modal--large": large,
                    [`${className}`]: className,
                }), onClick: () => (backgroundClose ? close() : null), children: _jsxs("div", { className: "modal__window", onClick: (e) => {
                        e.stopPropagation();
                    }, children: [title && (_jsxs("div", { className: "modal__header", children: [_jsx("h2", { children: title }), !confirm && _jsx(IconClose, { onClick: close })] })), children, confirm && (_jsxs("div", { className: "modal__footer text-right mt-4", children: [_jsx("button", { className: "md-button md-button--grey", onClick: close, children: "Cancel" }), _jsx("button", { className: "md-button ml-1", onClick: confirm, children: "Confirm" })] }))] }) })) : null }), dest)
        : null;
};
