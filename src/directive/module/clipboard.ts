/**
 * v-clipboard 文字复制剪贴
 * Copyright (c) 2021 common
 */

import Clipboard from "clipboard";
export default {
	bind(el: any, binding: { arg: string; value: string; }, vnode: any) {
		switch (binding.arg) {
			case "success":
				el._vClipBoard_success = binding.value;
				break;
			case "error":
				el._vClipBoard_error = binding.value;
				break;
			default: {
				const clipboard = new Clipboard(el, {
					text: () => binding.value,
					action: () => (binding.arg === "cut" ? "cut" : "copy")
				});
				clipboard.on("success", e => {
					const callback = el._vClipBoard_success;
					callback && callback(e);
				});
				clipboard.on("error", e => {
					const callback = el._vClipBoard_error;
					callback && callback(e);
				});
				el._vClipBoard = clipboard;
			}
		}
	},
	update(el: { _vClipBoard_success: any; _vClipBoard_error: any; _vClipBoard: { text: () => any; action: () => "cut" | "copy"; }; }, binding: { arg: string; value: any; }) {
		if (binding.arg === "success") {
			el._vClipBoard_success = binding.value;
		} else if (binding.arg === "error") {
			el._vClipBoard_error = binding.value;
		} else {
			el._vClipBoard.text = function() {
				return binding.value;
			};
			el._vClipBoard.action = () =>
				binding.arg === "cut" ? "cut" : "copy";
		}
	},
	unbind(el: any, binding: any) {
		if (!el._vClipboard) return;
		if (binding.arg === "success") {
			delete el._vClipBoard_success;
		} else if (binding.arg === "error") {
			delete el._vClipBoard_error;
		} else {
			el._vClipBoard.destroy();
			delete el._vClipBoard;
		}
	}
};
