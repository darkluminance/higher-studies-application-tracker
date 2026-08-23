import toast from "react-hot-toast";

/**
 * Calm toast helpers. The palette & tone stay reassuring — never alarming red.
 * Re-exported so features import from one place.
 */
export { toast };

export const notify = {
	success: (message: string) => toast.success(message),
	error: (message: string) => toast.error(message),
	loading: (message: string) => toast.loading(message),
	promise: toast.promise,
};
