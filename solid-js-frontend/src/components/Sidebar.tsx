import { A, useLocation } from "@solidjs/router";
import { createEffect, createMemo, createSignal, Show } from "solid-js";

export default function Sidebar() {
	const location = useLocation();
	const [currentPath, setCurrentPath] = createSignal(
		location.pathname.slice(1)
	);

	createEffect(() => {
		setCurrentPath(location.pathname.slice(1));
	});

	return (
		<div class="w-56 h-full bg-gray-700 text-white p-4">
			<A href="/" class="text-orange-500 block h-4">
				<Show
					when={currentPath() !== ""}
					fallback={<span class="text-cyan-400">Home</span>}
				>
					{"<"} Back to Home
				</Show>
			</A>
			<ul class="mt-8 space-y-5">
				<li class={currentPath() === "university" ? "text-cyan-400" : ""}>
					<A href="/university">Universities</A>
				</li>
				<li class={currentPath() === "faculty" ? "text-cyan-400" : ""}>
					<A href="/faculty">Faculties</A>
				</li>
				<li class={currentPath() === "mail" ? "text-cyan-400" : ""}>
					<A href="/mail">Mails</A>
				</li>
				<li class={currentPath() === "interview" ? "text-cyan-400" : ""}>
					<A href="/interview">Interviews</A>
				</li>
				<li class={currentPath() === "recommender" ? "text-cyan-400" : ""}>
					<A href="/recommender">Recommenders</A>
				</li>
				<li class={currentPath() === "application" ? "text-cyan-400" : ""}>
					<A href="/application">Applications</A>
				</li>
			</ul>
		</div>
	);
}
