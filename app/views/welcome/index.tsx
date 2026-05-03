import { useSelector } from "react-redux";
import { Navbar } from "~/components/navbar";
import { Taskbar } from "~/components/taskbar";
import { WindowManager } from "~/components/window-manager";
import wallDefault from "~/assets/images/windows-dark.jpg";
import type { RootState } from "~/redux/reducers";

export default function Welcome() {
	const backgroundImage = useSelector((s: RootState) => s.backgroundImage.backgroundImage);
	const bg = backgroundImage || wallDefault;

	return (
		<div
			className="min-h-screen bg-cover bg-center bg-no-repeat pb-20"
			style={{ backgroundImage: `url(${bg})` }}
		>
			<Navbar />
			<WindowManager />
			<Taskbar />
		</div>
	);
}
