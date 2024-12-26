import { A } from "@solidjs/router";

export default function Sidebar() {
	return (
		<div class="w-56 h-full bg-gray-700 text-white p-4">
			<A href="/" class="text-orange-500">
				{"<"} Back to home
			</A>
			<ul class="mt-16 space-y-5">
				<li class="opacity-50">All entries</li>
				<li>
					<A href="/university">Universities</A>
				</li>
				<li>
					<A href="/recommender">Recommenders</A>
				</li>
				<li>
					<A href="/faculty">Faculties</A>
				</li>
				<li>
					<A href="/interview">Interviews</A>
				</li>
			</ul>
			<ul class="mt-16 space-y-5">
				<li class="opacity-50">List entries</li>
				<li>
					<A href="/university_application">University Applications</A>
				</li>
				<li>
					<A href="/mail">Mails status</A>
				</li>
			</ul>
		</div>
	);
}
