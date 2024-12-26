import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const DashboardBase = (props: any) => {
	return (
		<div class="h-screen w-screen overflow-hidden">
			<Topbar />
			<div class="flex h-full">
				<div class="h-full">
					<Sidebar />
				</div>
				<div class="w-full overflow-hidden">{props.component}</div>
			</div>
		</div>
	);
};

export default DashboardBase;
