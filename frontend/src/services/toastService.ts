import { toast } from "react-toastify";

export class ToastService {
	static success(message: string, options?: object) {
		return toast.success(message, {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			...options,
		});
	}

	static error(message: string, options?: object) {
		return toast.error(message, {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			...options,
		});
	}

	static info(message: string, options?: object) {
		return toast.info(message, {
			position: "top-right",
			autoClose: 4000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			...options,
		});
	}

	static warning(message: string, options?: object) {
		return toast.warning(message, {
			position: "top-right",
			autoClose: 4000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			...options,
		});
	}

	static promise<T>(
		promise: Promise<T>,
		{
			loading,
			success,
			error,
		}: {
			loading: string;
			success: string | ((data: T) => string);
			error: string | ((error: any) => string);
		}
	) {
		return toast.promise(promise, {
			pending: loading,
			success: success,
			error: error,
		});
	}
}
