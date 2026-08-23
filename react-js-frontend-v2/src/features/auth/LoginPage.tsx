import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

export function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation() as { state?: { from?: { pathname: string } } };
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const username = String(form.get("username") ?? "");
		const password = String(form.get("password") ?? "");

		setLoading(true);
		try {
			await login(username, password);
			toast.success("Welcome back");
			navigate(location.state?.from?.pathname ?? "/", { replace: true });
		} catch (err) {
			const message =
				err instanceof ApiError && err.status === 401
					? "Those details didn't match. Try again."
					: err instanceof ApiError
						? err.message
						: "Couldn't sign in. Please try again.";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout
			brandSide="left"
			pitch="Track the journey to your dream school — calmly, in one place."
			footnote="Made for the long road ahead."
		>
			<h1 className="font-serif text-[24px] text-ink">Welcome back</h1>
			<p className="mt-1 text-[13.5px] text-ink-soft">
				Pick up right where you left off.
			</p>
			<form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
				<Field label="Username" htmlFor="username">
					<Input id="username" name="username" required autoComplete="username" />
				</Field>
				<Field label="Password" htmlFor="password">
					<Input
						id="password"
						name="password"
						type="password"
						required
						autoComplete="current-password"
					/>
				</Field>
				<Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
					Sign in
				</Button>
			</form>
			<p className="mt-5 text-center text-[13px] text-ink-soft">
				New here?{" "}
				<Link to="/register" className="font-semibold text-clay hover:text-clay-hover">
					Create an account
				</Link>
			</p>
		</AuthLayout>
	);
}
