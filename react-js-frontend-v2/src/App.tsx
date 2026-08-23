import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";

import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { UniversityPage } from "@/features/university/UniversityPage";
import { ApplicationPage } from "@/features/application/ApplicationPage";
import { FacultyPage } from "@/features/faculty/FacultyPage";
import { RecommenderPage } from "@/features/recommender/RecommenderPage";
import { MailPage } from "@/features/mail/MailPage";
import { InterviewPage } from "@/features/interview/InterviewPage";
import { RecommendationStatusPage } from "@/features/recommendation/RecommendationStatusPage";
import { NotFoundPage } from "@/features/shared/NotFoundPage";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
			staleTime: 30_000,
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthProvider>
					<Toaster
						position="bottom-left"
						toastOptions={{
							style: {
								background: "#fbf7ef",
								color: "#33302a",
								border: "1px solid #e6dccb",
								borderRadius: "12px",
								fontSize: "13.5px",
								fontFamily: '"Mulish Variable", sans-serif',
							},
							success: { iconTheme: { primary: "#5c6a45", secondary: "#fbf7ef" } },
							error: { iconTheme: { primary: "#a26a4f", secondary: "#fbf7ef" } },
						}}
					/>
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />

						<Route element={<ProtectedRoute />}>
							<Route element={<AppShell />}>
								<Route path="/" element={<DashboardPage />} />
								<Route path="/university" element={<UniversityPage />} />
								<Route path="/application" element={<ApplicationPage />} />
								<Route path="/faculty" element={<FacultyPage />} />
								<Route path="/recommender" element={<RecommenderPage />} />
								<Route path="/mail" element={<MailPage />} />
								<Route path="/interview" element={<InterviewPage />} />
								<Route
									path="/recommendation_status/:applicationId"
									element={<RecommendationStatusPage />}
								/>
							</Route>
						</Route>

						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</AuthProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}
