import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "~/redux/reducers";
import { openApp, openAppByTitle } from "~/redux/features/all-apps-slice";
import type { AllAppsState } from "~/redux/features/all-apps-slice";

const Taskbar = () => {
	const dispatch = useDispatch();
	const apps = useSelector((state: RootState) => state.allApps);
	const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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
		<div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-gradient-to-t from-gray-900/98 to-gray-800/95 backdrop-blur-xl border-t border-gray-600/50 px-3 py-2 shadow-2xl">
			{/* Start menu area */}
			<div className="flex items-center space-x-2">
				<button className="group p-2.5 rounded-lg hover:bg-gray-700/60 transition-all duration-200 hover:scale-105 active:scale-95" title="Applications">
					<svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
						<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
					</svg>
				</button>
				<div className="w-px h-6 bg-gray-600/50"></div>
			</div>

			{/* App icons area */}
			<div className="flex items-center space-x-1">
				{apps.map((app: AllAppsState) => (
					<button
						key={app.id}
						onClick={() => handleAppClick(app.slug)}
						className={`
							relative p-2.5 rounded-lg transition-all duration-200 group
							hover:bg-gray-700/60 hover:scale-105 active:scale-95
							${app.isOpen && !app.isMinimized ? 'bg-gray-600/50 shadow-lg' : 'bg-transparent'}
						`}
						title={app.title}
					>
						<img
							src={app.imageSrc}
							alt={app.title}
							className="w-5 h-5 object-contain filter brightness-90 group-hover:brightness-100 transition-all duration-200"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffffff"><text x="12" y="16" text-anchor="middle" font-size="12" fill="white">${app.title[0]}</text></svg>`;
							}}
						/>
						{app.isOpen && !app.isMinimized && (
							<div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm animate-pulse"></div>
						)}
					</button>
				))}
			</div>

			{/* System tray area */}
			<div className="flex items-center space-x-3">
				<div className="flex items-center space-x-2 text-white text-sm font-medium">
					<svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
						<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
					</svg>
					<span className="px-2 py-1 text-xs bg-gray-700/50 rounded-md font-mono">
						{currentTime}
					</span>
				</div>
			</div>
		</div>
	);
};

export { Taskbar };
