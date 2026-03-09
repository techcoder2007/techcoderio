import {
	type CSSProperties,
	type PointerEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppIcon } from "~/components/app-icon";
import type { AllAppsState } from "~/redux/features/all-apps-slice";
import {
	changePosition,
	closeApp,
	maximizeApp,
	minimizeApp,
	zIndexApp,
} from "~/redux/features/all-apps-slice";
import type { RootState } from "~/redux/reducers";

const WindowManager = () => {
	const dispatch = useDispatch();
	const apps = useSelector((state: RootState) => state.allApps);

	const handleClose = (appId: string) => {
		dispatch(closeApp(appId));
	};

	const handleMinimize = (appId: string) => {
		dispatch(minimizeApp(appId));
	};

	const handleMaximize = (appId: string) => {
		dispatch(maximizeApp(appId));
	};

	const handleFocus = (appId: string) => {
		dispatch(zIndexApp(appId));
	};

	const handleDrag = (appId: string, newPosition: { x: number; y: number }) => {
		dispatch(changePosition({ id: appId, position: newPosition }));
	};

	return (
		<>
			{apps
				.filter((app: AllAppsState) => app.isOpen && !app.isMinimized)
				.sort((a: AllAppsState, b: AllAppsState) => a.zIndex - b.zIndex)
				.map((app: AllAppsState) => (
					<Window
						key={app.id}
						app={app}
						onClose={() => handleClose(app.id)}
						onMinimize={() => handleMinimize(app.id)}
						onMaximize={() => handleMaximize(app.id)}
						onFocus={() => handleFocus(app.id)}
						onDrag={(position) => handleDrag(app.id, position)}
					/>
				))}
		</>
	);
};

interface WindowProps {
	app: AllAppsState;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
	onFocus: () => void;
	onDrag: (position: { x: number; y: number }) => void;
}

const Window = ({
	app,
	onClose,
	onMinimize,
	onMaximize,
	onFocus,
	onDrag,
}: WindowProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const dragOffset = useRef({ x: 0, y: 0 });
	const frameRef = useRef<number | null>(null);
	const pendingPosition = useRef<{ x: number; y: number } | null>(null);

	const flushDrag = () => {
		if (!pendingPosition.current) return;
		onDrag(pendingPosition.current);
		pendingPosition.current = null;
		frameRef.current = null;
	};

	const clampPosition = (x: number, y: number) => {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const windowWidth = app.maximized ? viewportWidth : 800;
		const windowHeight = app.maximized ? viewportHeight - 80 : 600;
		return {
			x: Math.min(Math.max(x, 0), viewportWidth - windowWidth),
			y: Math.min(Math.max(y, 0), viewportHeight - windowHeight - 72),
		};
	};

	const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
		if (app.maximized || e.button !== 0) return;
		if (!(e.target as HTMLElement).closest(".window-header")) return;

		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		setIsDragging(true);
		dragOffset.current = {
			x: e.clientX - (app.position.x || 100),
			y: e.clientY - (app.position.y || 100),
		};
		onFocus();
	};

	const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
		if (!isDragging) return;
		e.preventDefault();

		const position = clampPosition(
			e.clientX - dragOffset.current.x,
			e.clientY - dragOffset.current.y,
		);
		pendingPosition.current = position;

		if (!frameRef.current) {
			frameRef.current = requestAnimationFrame(flushDrag);
		}
	};

	const stopDragging = () => {
		setIsDragging(false);
		if (frameRef.current) {
			cancelAnimationFrame(frameRef.current);
			frameRef.current = null;
		}
		flushDrag();
	};

	useEffect(() => {
		return () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}
		};
	}, []);

	const windowStyle: CSSProperties = {
		position: "fixed",
		left: app.position.x || 100,
		top: app.position.y || 100,
		width: app.maximized ? "100vw" : "800px",
		height: app.maximized ? "calc(100vh - 80px)" : "600px",
		zIndex: app.zIndex,
	};

	const AppComponent = app.app;

	return (
		<div
			className={`fixed bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden transition-shadow duration-150 ${isDragging ? "cursor-grabbing shadow-blue-500/20" : "cursor-default"}`}
			style={windowStyle}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={stopDragging}
			onPointerCancel={stopDragging}
		>
			<div className="flex justify-between items-center px-4 py-2 from-gray-800 cursor-move select-none bg-linear-to-r window-header to-gray-750 touch-none">
				<div className="flex items-center space-x-3">
					<AppIcon name={app.iconName} className="w-4 h-4 text-white" />
					<span className="text-sm font-medium tracking-wide text-white">
						{app.title}
					</span>
				</div>
				<div className="flex items-center space-x-2">
					<button
						onClick={onMinimize}
						type="button"
						className="w-3 h-3 bg-yellow-500 rounded-full shadow-md transition-all duration-150 hover:bg-yellow-400 hover:scale-110"
						title="Minimize"
					/>
					<button
						type="button"
						onClick={onMaximize}
						className="w-3 h-3 bg-green-500 rounded-full shadow-md transition-all duration-150 hover:bg-green-400 hover:scale-110"
						title={app.maximized ? "Restore" : "Maximize"}
					/>
					<button
						type="button"
						onClick={onClose}
						className="w-3 h-3 bg-red-500 rounded-full shadow-md transition-all duration-150 hover:bg-red-400 hover:scale-110"
						title="Close"
					/>
				</div>
			</div>

			<div className="overflow-hidden h-full bg-gray-950">
				<AppComponent id={app.id} />
			</div>
		</div>
	);
};

export { WindowManager };
