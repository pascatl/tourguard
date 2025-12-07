import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { User, LoginData, RegisterData, ApiResponse } from "../types";
import { api } from "../services/api";

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (data: LoginData) => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
	logout: () => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check for stored auth data on app start
		const storedToken = localStorage.getItem("tourguard_token");
		const storedUser = localStorage.getItem("tourguard_user");

		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
			api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
		}

		setLoading(false);
	}, []);

	const login = async (data: LoginData): Promise<void> => {
		try {
			const response = await api.post<
				ApiResponse<{ user: User; token: string }>
			>("/auth/login", data);

			if (response.data.success && response.data.data) {
				const { user: userData, token: authToken } = response.data.data;

				setUser(userData);
				setToken(authToken);

				localStorage.setItem("tourguard_token", authToken);
				localStorage.setItem("tourguard_user", JSON.stringify(userData));

				api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
			} else {
				throw new Error(response.data.error || "Login failed");
			}
		} catch (error: any) {
			throw new Error(error.response?.data?.error || "Login failed");
		}
	};

	const register = async (data: RegisterData): Promise<void> => {
		try {
			const response = await api.post<
				ApiResponse<{ user: User; token: string }>
			>("/auth/register", data);

			if (response.data.success && response.data.data) {
				const { user: userData, token: authToken } = response.data.data;

				setUser(userData);
				setToken(authToken);

				localStorage.setItem("tourguard_token", authToken);
				localStorage.setItem("tourguard_user", JSON.stringify(userData));

				api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
			} else {
				throw new Error(response.data.error || "Registration failed");
			}
		} catch (error: any) {
			throw new Error(error.response?.data?.error || "Registration failed");
		}
	};

	const logout = (): void => {
		setUser(null);
		setToken(null);

		localStorage.removeItem("tourguard_token");
		localStorage.removeItem("tourguard_user");

		delete api.defaults.headers.common["Authorization"];
	};

	const value: AuthContextType = {
		user,
		token,
		login,
		register,
		logout,
		loading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
