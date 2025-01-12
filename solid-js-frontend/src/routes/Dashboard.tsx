import { createEffect, createSignal, For, Show } from "solid-js";
import DashboardBase from "../components/DashboardBase";
import TipsIcon from "../components/Icons/TipsIcon";
import { getAuthenticatedData } from "../utils";

export default function Dashboard() {
	return (
		<>
			<DashboardBase component={HomeTimeline} />
		</>
	);
}

function HomeTimeline() {
	type Timeline = {
		Timeline: [
			{
				type: string;
				name: string;
				designation: string | undefined;
				university_name: string | undefined;
				date: string;
			}
		];
		Applieduniversitycount: number;
		Repliedmailscount: number;
		Universityapplicationcount: number;
		Recommendationcount: number;
	};
	const [timelineData, setTimelineData] = createSignal<Timeline>(
		{} as Timeline
	);

	createEffect(async () => {
		const timelinedata = await getAuthenticatedData("/timeline/user/get");

		if (timelinedata) {
			timelinedata[0].Timeline = JSON.parse(timelinedata[0].Timeline);
			setTimelineData(timelinedata[0]);
		}
	});

	return (
		<div class="p-8 px-16 flex gap-8">
			<div class="flex flex-col gap-4 md:w-11/12">
				<h1 class="text-3xl mb-8">Upcoming Events</h1>
				<Show when={!timelineData()?.Timeline?.length}>
					No upcoming events to show
				</Show>
				<For each={timelineData().Timeline}>
					{(timelineItem, index) => (
						<div
							class="cursor-pointer border rounded-xl py-8 px-16 flex flex-col justify-center gap-2 bg-white drop-shadow-sm hover:drop-shadow-2xl"
							style={
								"opacity:" +
								(1 - index() / 5) +
								"; width:" +
								(100 - index() * 5) +
								"%"
							}
						>
							<h1 class="text-md text-gray-500 tracking-wide">
								{timelineItem.type === "University"
									? "Upcoming Deadline"
									: "Upcoming Interview"}
							</h1>
							<h2
								class={
									timelineItem.type === "University"
										? "text-gray-700 truncate leading-normal font-medium text-4xl "
										: "text-gray-700 truncate leading-normal font-medium text-3xl"
								}
							>
								{timelineItem.name}
							</h2>
							<p class="text-gray-600">
								{timelineItem.type === "University"
									? ""
									: timelineItem.designation +
									  ", " +
									  timelineItem.university_name}
							</p>
							<p class="text-gray-500">
								{new Date(timelineItem.date).toLocaleString()}
							</p>
						</div>
					)}
				</For>
			</div>

			<div class="flex flex-col gap-8">
				<div class="grid grid-cols-2 gap-4 cursor-pointer text-center h-fit">
					<div class="border rounded-xl p-8 h-48 flex flex-col items-center justify-center gap-4 bg-white drop-shadow-sm hover:drop-shadow-2xl">
						<h1 class="text-5xl text-gray-700">
							{Math.round(timelineData().Applieduniversitycount * 100)}%
						</h1>
						<p class="text-gray-500">Universities applied from the list</p>
					</div>
					<div class="border rounded-xl p-8 h-48 flex flex-col items-center justify-center gap-4 bg-white drop-shadow-sm hover:drop-shadow-2xl">
						<h1 class="text-5xl text-gray-700">
							{Math.round(timelineData().Recommendationcount * 100)}%
						</h1>
						<p class="text-gray-500">Recommendations submitted</p>
					</div>
					<div class="border rounded-xl p-8 h-48 flex flex-col items-center justify-center gap-4 bg-white drop-shadow-sm hover:drop-shadow-2xl">
						<h1 class="text-5xl text-gray-700">
							{Math.round(timelineData().Repliedmailscount * 100)}%
						</h1>
						<p class="text-gray-500">Faculties replied back to their mails</p>
					</div>
					<div class="border rounded-xl p-8 h-48 flex flex-col items-center justify-center gap-4 bg-white drop-shadow-sm hover:drop-shadow-2xl">
						<h1 class="text-5xl text-gray-700">
							{timelineData().Universityapplicationcount}
						</h1>
						<p class="text-gray-500">Applications created so far</p>
					</div>
				</div>

				<div class="flex flex-col gap-4">
					<a
						href="https://nextopusa.com/basic_terminology/"
						target="__blank"
						class="w-full h-24 px-8 cursor-pointer border rounded-xl flex items-center gap-4 bg-white drop-shadow-sm hover:drop-shadow-2xl"
					>
						<TipsIcon width="48px"></TipsIcon>
						What you need to know before start applying to universities in the
						USA
					</a>
					<a
						href="https://nextopusa.com/ultimate_checklist/"
						target="__blank"
						class="w-full h-24 px-8 cursor-pointer border rounded-xl flex items-center gap-4 bg-white drop-shadow-sm hover:drop-shadow-2xl"
					>
						<TipsIcon width="48px"></TipsIcon>
						Your ultimate checklist for applying to universities in the USA
					</a>
					<a
						href="https://nextopusa.com/category/other_application_materials/university/"
						target="__blank"
						class="w-full h-24 px-8 cursor-pointer border rounded-xl flex items-center gap-4 bg-white drop-shadow-sm hover:drop-shadow-2xl"
					>
						<TipsIcon width="48px"></TipsIcon>
						How to shortlist universities
					</a>
					<a
						href="https://www.facebook.com/groups/nextop.usa/posts/8595683310530771/"
						target="__blank"
						class="w-full h-24 px-8 cursor-pointer border rounded-xl flex items-center gap-4 bg-white drop-shadow-sm hover:drop-shadow-2xl"
					>
						<TipsIcon width="48px"></TipsIcon>
						Central funding campus list, USA
					</a>
				</div>
			</div>
		</div>
	);
}
