import type { Component } from "solid-js";
import Register from "./routes/Register";
import { Router, Route } from "@solidjs/router";
import Login from "./routes/Login";
import ProtectedRoute from "./Protected";
import Dashboard from "./routes/Dashboard";
import { Toaster } from "solid-toast";
import University from "./routes/University";
import Recommender from "./routes/Recommender";
import Error404 from "./routes/404";
import Faculty from "./routes/Faculty";
import Interview from "./routes/Interview";
import Mail from "./routes/Mail";
import Application from "./routes/Application";
import RecommendationStatus from "./routes/RecommendationStatus";

const App: Component = () => {
	return (
		<>
			<Toaster position="bottom-left"></Toaster>
			<Router>
				<Route path="/register" component={Register}></Route>
				<Route path="/login" component={Login}></Route>
				<Route
					path="/"
					component={() => ProtectedRoute({ children: Dashboard })}
				></Route>

				<Route
					path="/university"
					component={() => ProtectedRoute({ children: University })}
				></Route>

				<Route
					path="/recommender"
					component={() => ProtectedRoute({ children: Recommender })}
				></Route>

				<Route
					path="/faculty"
					component={() => ProtectedRoute({ children: Faculty })}
				></Route>

				<Route
					path="/interview"
					component={() => ProtectedRoute({ children: Interview })}
				></Route>

				<Route
					path="/mail"
					component={() => ProtectedRoute({ children: Mail })}
				></Route>

				<Route
					path="/application"
					component={() => ProtectedRoute({ children: Application })}
				></Route>

				<Route
					path="/recommendation_status/:university_id"
					component={() => ProtectedRoute({ children: RecommendationStatus })}
				></Route>

				<Route path="*" component={Error404} />
			</Router>
		</>
	);
};

export default App;
