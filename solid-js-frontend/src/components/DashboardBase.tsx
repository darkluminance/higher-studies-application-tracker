import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const DashboardBase = (props: any) => {
	return (
		<div class="h-full w-full flex flex-col">
			<div>
				<Topbar />
			</div>
			<div class="flex h-full overflow-hidden">
				<div class="h-full">
					<Sidebar />
				</div>
				<div class="w-full overflow-auto">{props.component}</div>
			</div>
		</div>
	);
};

export default DashboardBase;
