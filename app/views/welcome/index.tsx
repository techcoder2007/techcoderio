import { useSelector } from "react-redux";
import wallDefault from "~/assets/images/windows-dark.jpg";
import { Navbar } from "~/components/navbar";
import { Taskbar } from "~/components/taskbar";
import { WindowManager } from "~/components/window-manager";
import type { RootState } from "~/redux/reducers";

export default function Welcome() {
	const backgroundImage = useSelector(
		(s: RootState) => s.backgroundImage.backgroundImage,
	);
	const brightnessLevel = useSelector(
		(s: RootState) => s.status.brightnessLevel,
	);
	const bg = backgroundImage || wallDefault;

	return (
		<div
			className="min-h-screen bg-cover bg-center bg-no-repeat pb-20 transition-[filter] duration-200"
			style={{
				backgroundImage: `url(${bg})`,
				filter: `brightness(${Math.max(10, Math.min(100, brightnessLevel))}%)`,
			}}
		>
			<Navbar />
			<WindowManager />
			<Taskbar />
		</div>
	);
}
