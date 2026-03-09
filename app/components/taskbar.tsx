import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppIcon } from "~/components/app-icon";
import type { AllAppsState } from "~/redux/features/all-apps-slice";
import { openApp } from "~/redux/features/all-apps-slice";
import type { RootState } from "~/redux/reducers";

const Taskbar = () => {
	const dispatch = useDispatch();
	const apps = useSelector((state: RootState) => state.allApps);
	const [currentTime, setCurrentTime] = useState(
		new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
	);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(
				new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
			);
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const handleAppClick = (slug: string) => {
		const app = apps.find((app: AllAppsState) => app.slug === slug);
		if (app) {
			dispatch(openApp(app.id));
		}
	};

	return (
		<div className="fixed right-0 bottom-3 left-0 z-50 px-4 pointer-events-none">
			<div className="flex justify-center items-end gap-3 mx-auto w-fit">
				<div className="flex gap-1 items-end px-4 py-3 rounded-3xl border shadow-2xl pointer-events-auto backdrop-blur-2xl bg-gray-900/60 border-gray-200/20">
					{apps.map((app: AllAppsState) => (
						<button
							type="button"
							key={app.id}
							onClick={() => handleAppClick(app.slug)}
							className={`
								relative p-3.5 rounded-2xl transition-all duration-200 group
								hover:-translate-y-2 hover:scale-110 active:scale-95
								${app.isOpen && !app.isMinimized ? "bg-white/20" : "bg-white/10 hover:bg-white/15"}
							`}
							title={app.title}
						>
							<AppIcon
								name={app.iconName}
								className="w-8 h-8 text-white drop-shadow-md"
								strokeWidth={2}
							/>
							{app.isOpen && !app.isMinimized && (
								<div className="absolute -bottom-1.5 left-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2" />
							)}
						</button>
					))}
				</div>
				<div className="px-3 py-2 rounded-2xl border shadow-xl pointer-events-auto backdrop-blur-2xl bg-gray-900/55 border-gray-200/20">
					<span className="font-mono text-xs text-white">{currentTime}</span>
				</div>
			</div>
		</div>
	);
};

export { Taskbar };
