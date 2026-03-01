import { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "~/redux/reducers";
import type { AllAppsState } from "~/redux/features/all-apps-slice";
import {
	closeApp,
	minimizeApp,
	maximizeApp,
	zIndexApp,
	changePosition,
} from "~/redux/features/all-apps-slice";

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
	const dragStartPos = useRef({ x: 0, y: 0 });
	const windowStartPos = useRef({ x: 0, y: 0 });
	const animationFrameRef = useRef<number | null>(null);
	const lastUpdateTime = useRef(0);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (
			e.target === e.currentTarget ||
			(e.target as HTMLElement).classList.contains("window-header")
		) {
			setIsDragging(true);
			dragStartPos.current = { x: e.clientX, y: e.clientY };
			windowStartPos.current = { x: app.position.x, y: app.position.y };
			onFocus();
		}
	};

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return;

			// Throttle updates to 60fps for better performance
			const now = performance.now();
			if (now - lastUpdateTime.current < 16) return; // ~60fps
			lastUpdateTime.current = now;

			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}

			animationFrameRef.current = requestAnimationFrame(() => {
				const deltaX = e.clientX - dragStartPos.current.x;
				const deltaY = e.clientY - dragStartPos.current.y;
				onDrag({
					x: windowStartPos.current.x + deltaX,
					y: windowStartPos.current.y + deltaY,
				});
			});
		},
		[isDragging, onDrag],
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove, { passive: true });
			document.addEventListener("mouseup", handleMouseUp, { passive: true });
			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
				}
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp]);

	const windowStyle: React.CSSProperties = {
		position: "fixed",
		left: app.position.x || 100,
		top: app.position.y || 100,
		width: app.maximized ? "100vw" : "800px",
		height: app.maximized ? "calc(100vh - 80px)" : "600px",
		zIndex: app.zIndex,
		transform: "translateZ(0)", // Hardware acceleration
		willChange: isDragging ? "transform" : "auto", // Optimize for animations
	};

	const AppComponent = app.app;

	return (
		<div
			className={`fixed bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden transition-all duration-200 ${isDragging ? "cursor-grabbing scale-105 shadow-3xl" : "cursor-grab"}`}
			style={windowStyle}
			onMouseDown={handleMouseDown}
		>
			{/* Window Header */}
			<div className="window-header flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-750 px-4 py-2 cursor-move select-none">
				<div className="flex items-center space-x-3">
					<img
						src={app.imageSrc}
						alt={app.title}
						className="w-4 h-4 object-contain filter brightness-100"
					/>
					<span className="text-white text-sm font-medium tracking-wide">
						{app.title}
					</span>
				</div>
				<div className="flex items-center space-x-2">
					<button
						onClick={onMinimize}
						className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-all duration-150 hover:scale-110 shadow-md"
						title="Minimize"
					/>
					<button
						onClick={onMaximize}
						className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-all duration-150 hover:scale-110 shadow-md"
						title={app.maximized ? "Restore" : "Maximize"}
					/>
					<button
						onClick={onClose}
						className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-all duration-150 hover:scale-110 shadow-md"
						title="Close"
					/>
				</div>
			</div>

			{/* Window Content */}
			<div className="h-full bg-gray-950 overflow-hidden">
				<AppComponent id={app.id} />
			</div>
		</div>
	);
};

export { WindowManager };
