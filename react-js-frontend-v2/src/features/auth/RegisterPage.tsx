import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

export function RegisterPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		setLoading(true);
		try {
			await authService.register({
				name: String(form.get("name") ?? ""),
				username: String(form.get("username") ?? ""),
				email: String(form.get("email") ?? ""),
				password: String(form.get("password") ?? ""),
			});
			toast.success(
				"Account created. Check your inbox — you can sign in now.",
				{ duration: 5000 }
			);
			navigate("/login");
		} catch (err) {
			toast.error(
				err instanceof ApiError ? err.message : "Couldn't create your account."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout
			brandSide="right"
			brandWidth={200}
			pitch="One quiet place for universities, faculty, letters and interviews."
			footnote="No rush. No clutter."
		>
			<h1 className="font-serif text-[24px] text-ink">Create your account</h1>
			<p className="mt-1 text-[13.5px] text-ink-soft">
				A calm home for your applications.
			</p>
			<form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field label="Name" htmlFor="name">
						<Input id="name" name="name" required autoComplete="name" />
					</Field>
					<Field label="Username" htmlFor="username">
						<Input id="username" name="username" required autoComplete="username" />
					</Field>
				</div>
				<Field label="Email" htmlFor="email">
					<Input id="email" name="email" type="email" required autoComplete="email" />
				</Field>
				<Field label="Password" htmlFor="password">
					<Input
						id="password"
						name="password"
						type="password"
						required
						autoComplete="new-password"
					/>
				</Field>
				<Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
					Create account
				</Button>
			</form>
			<p className="mt-5 text-center text-[13px] text-ink-soft">
				Already have an account?{" "}
				<Link to="/login" className="font-semibold text-clay hover:text-clay-hover">
					Sign in
				</Link>
			</p>
		</AuthLayout>
	);
}
