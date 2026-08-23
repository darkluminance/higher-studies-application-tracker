import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService, configureHttp } from "@/lib/api";
import type { User } from "@/types";

const TOKEN_KEY = "token";
const USER_KEY = "userdata";

interface AuthContextValue {
	user: User | null;
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<User>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readCachedUser(): User | null {
	try {
		const raw = sessionStorage.getItem(USER_KEY);
		return raw ? (JSON.parse(raw) as User) : null;
	} catch {
		return null;
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	// Ref always holds the latest token so the HTTP client reads current state.
	const tokenRef = useRef<string | null>(sessionStorage.getItem(TOKEN_KEY));
	const [user, setUser] = useState<User | null>(readCachedUser);

	const logout = useCallback(() => {
		tokenRef.current = null;
		sessionStorage.removeItem(TOKEN_KEY);
		sessionStorage.removeItem(USER_KEY);
		setUser(null);
		navigate("/login", { replace: true });
	}, [navigate]);

	// Wire the injected concerns into the framework-agnostic HTTP client.
	useEffect(() => {
		configureHttp({
			getToken: () => tokenRef.current,
			onUnauthorized: () => logout(),
		});
	}, [logout]);

	// If we have a token but no cached user (e.g. after a hard refresh), rehydrate.
	useEffect(() => {
		if (tokenRef.current && !user) {
			authService
				.currentUser()
				.then((u) => {
					setUser(u);
					sessionStorage.setItem(USER_KEY, JSON.stringify(u));
				})
				.catch(() => {
					/* onUnauthorized handles an expired token */
				});
		}
		// run once on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const login = useCallback(async (username: string, password: string) => {
		const { token } = await authService.login(username, password);
		tokenRef.current = token;
		sessionStorage.setItem(TOKEN_KEY, token);
		const u = await authService.currentUser();
		setUser(u);
		sessionStorage.setItem(USER_KEY, JSON.stringify(u));
		return u;
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			isAuthenticated: Boolean(tokenRef.current),
			login,
			logout,
		}),
		[user, login, logout]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
