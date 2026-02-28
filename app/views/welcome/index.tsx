import { Navbar } from "~/components/navbar";
import { Taskbar } from "~/components/taskbar";
import { WindowManager } from "~/components/window-manager";

export default function Welcome() {
	return (
		<div className="min-h-screen bg-cover bg-center bg-no-repeat techcoderio-welcome pb-20">
			<Navbar />
			<WindowManager />
			<Taskbar />
		</div>
	); 
}
