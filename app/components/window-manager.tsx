import {
	type CSSProperties,
	type PointerEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppIcon } from "~/components/app-icon";
import { dockRegistry } from "~/lib/dock-registry";
import type { AllAppsState } from "~/redux/features/all-apps-slice";
import {
	changePosition,
	changeSize,
	closeApp,
	maximizeApp,
	minimizeApp,
	zIndexApp,
} from "~/redux/features/all-apps-slice";
import type { RootState } from "~/redux/reducers";

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const TASKBAR_HEIGHT = 80;
const ANIMATION_DURATION = 280;
const GENIE_DURATION = 550;

type ResizeDirection =
	| "n" | "s" | "e" | "w"
	| "ne" | "nw" | "se" | "sw"
	| null;
type WindowAnimation = "opening" | "closing" | null;

const WindowManager = () => {
	const dispatch = useDispatch();
	const apps = useSelector((state: RootState) => state.allApps);

	return (
		<>
			{apps
				.filter((a) => a.isOpen && !a.isMinimized)
				.sort((a, b) => a.zIndex - b.zIndex)
				.map((app) => (
					<Window
						key={app.id}
						app={app}
						onClose={() => dispatch(closeApp(app.id))}
						onMinimize={() => dispatch(minimizeApp(app.id))}
						onMaximize={() => dispatch(maximizeApp(app.id))}
						onFocus={() => dispatch(zIndexApp(app.id))}
						onDrag={(p) => dispatch(changePosition({ id: app.id, position: p }))}
						onResize={(s, p) =>
							dispatch(changeSize({ id: app.id, size: s, position: p }))
						}
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
	onDrag: (p: { x: number; y: number }) => void;
	onResize: (s: { width: number; height: number }, p: { x: number; y: number }) => void;
}

const Window = ({
	app,
	onClose,
	onMinimize,
	onMaximize,
	onFocus,
	onDrag,
	onResize,
}: WindowProps) => {
	const elRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [resizeDir, setResizeDir] = useState<ResizeDirection>(null);
	const [animation, setAnimation] = useState<WindowAnimation>("opening");
	const [hoverControls, setHoverControls] = useState(false);

	const dragOffset = useRef({ x: 0, y: 0 });
	const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });
	const frameRef = useRef<number | null>(null);
	const pendingUpdate = useRef<{
		position?: { x: number; y: number };
		size?: { width: number; height: number };
	} | null>(null);

	const width = app.size?.width ?? 800;
	const height = app.size?.height ?? 600;

	useEffect(() => {
		const t = setTimeout(() => setAnimation(null), ANIMATION_DURATION);
		return () => clearTimeout(t);
	}, []);

	const flushUpdate = () => {
		const u = pendingUpdate.current;
		if (!u) {
			frameRef.current = null;
			return;
		}
		if (u.size && u.position) onResize(u.size, u.position);
		else if (u.position) onDrag(u.position);
		pendingUpdate.current = null;
		frameRef.current = null;
	};

	const clampPosition = (x: number, y: number, w = width) => {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		return {
			x: Math.min(Math.max(x, 0), Math.max(0, vw - w)),
			y: Math.min(Math.max(y, 0), Math.max(0, vh - TASKBAR_HEIGHT - 20)),
		};
	};

	// ───── Dragging ─────
	const handleHeaderPointerDown = (e: PointerEvent<HTMLDivElement>) => {
		if (app.maximized || e.button !== 0) return;
		if ((e.target as HTMLElement).closest("button")) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		setIsDragging(true);
		dragOffset.current = {
			x: e.clientX - (app.position.x || 100),
			y: e.clientY - (app.position.y || 100),
		};
		onFocus();
	};
	const handleHeaderPointerMove = (e: PointerEvent<HTMLDivElement>) => {
		if (!isDragging) return;
		e.preventDefault();
		pendingUpdate.current = {
			position: clampPosition(
				e.clientX - dragOffset.current.x,
				e.clientY - dragOffset.current.y,
			),
		};
		if (!frameRef.current) frameRef.current = requestAnimationFrame(flushUpdate);
	};
	const stopDragging = () => {
		if (!isDragging) return;
		setIsDragging(false);
		if (frameRef.current) {
			cancelAnimationFrame(frameRef.current);
			frameRef.current = null;
		}
		flushUpdate();
	};

	// ───── Resizing ─────
	const handleResizePointerDown = (
		e: PointerEvent<HTMLDivElement>,
		dir: ResizeDirection,
	) => {
		if (app.maximized || e.button !== 0) return;
		e.preventDefault();
		e.stopPropagation();
		e.currentTarget.setPointerCapture(e.pointerId);
		setResizeDir(dir);
		resizeStart.current = {
			x: e.clientX,
			y: e.clientY,
			width,
			height,
			posX: app.position.x || 100,
			posY: app.position.y || 100,
		};
		onFocus();
	};
	const handleResizePointerMove = (e: PointerEvent<HTMLDivElement>) => {
		if (!resizeDir) return;
		e.preventDefault();
		const dx = e.clientX - resizeStart.current.x;
		const dy = e.clientY - resizeStart.current.y;
		let nw = resizeStart.current.width;
		let nh = resizeStart.current.height;
		let nx = resizeStart.current.posX;
		let ny = resizeStart.current.posY;
		if (resizeDir.includes("e")) nw = Math.max(MIN_WIDTH, resizeStart.current.width + dx);
		if (resizeDir.includes("w")) {
			nw = Math.max(MIN_WIDTH, resizeStart.current.width - dx);
			nx = resizeStart.current.posX + (resizeStart.current.width - nw);
		}
		if (resizeDir.includes("s")) nh = Math.max(MIN_HEIGHT, resizeStart.current.height + dy);
		if (resizeDir.includes("n")) {
			nh = Math.max(MIN_HEIGHT, resizeStart.current.height - dy);
			ny = resizeStart.current.posY + (resizeStart.current.height - nh);
		}
		nw = Math.min(nw, window.innerWidth - nx);
		nh = Math.min(nh, window.innerHeight - TASKBAR_HEIGHT - ny);
		pendingUpdate.current = { size: { width: nw, height: nh }, position: { x: nx, y: ny } };
		if (!frameRef.current) frameRef.current = requestAnimationFrame(flushUpdate);
	};
	const stopResizing = () => {
		if (!resizeDir) return;
		setResizeDir(null);
		if (frameRef.current) {
			cancelAnimationFrame(frameRef.current);
			frameRef.current = null;
		}
		flushUpdate();
	};

	// ───── Close ─────
	const handleCloseAnimated = () => {
		setAnimation("closing");
		setTimeout(onClose, ANIMATION_DURATION);
	};

	// ───── Genie minimize ─────
	const handleMinimizeAnimated = () => {
		const el = elRef.current;
		if (!el) return onMinimize();

		const dockRect = dockRegistry.getRect(app.id);
		const winLeft = app.maximized ? 0 : app.position.x || 100;
		const winTop = app.maximized ? 0 : app.position.y || 100;
		const winW = app.maximized ? window.innerWidth : width;
		const winH = app.maximized ? window.innerHeight - TASKBAR_HEIGHT : height;

		// Dock target — fallback to bottom-center if no icon registered
		const dockX = dockRect ? dockRect.left + dockRect.width / 2 : window.innerWidth / 2;
		const dockY = dockRect ? dockRect.top + dockRect.height / 2 : window.innerHeight - 30;

		// Translation: from window's bottom-center to dock-center
		// Scale origin will be 50% 100% so the window shrinks toward its bottom edge
		const dx = dockX - (winLeft + winW / 2);
		const dy = dockY - (winTop + winH);

		const W = winW;
		const H = winH;

		// Both paths use identical command structure (4 cubic beziers) so CSS interpolates
		const startPath =
			`M 0 0 ` +
			`C ${W / 3} 0 ${(2 * W) / 3} 0 ${W} 0 ` +
			`C ${W} ${H / 3} ${W} ${(2 * H) / 3} ${W} ${H} ` +
			`C ${(2 * W) / 3} ${H} ${W / 3} ${H} 0 ${H} ` +
			`C 0 ${(2 * H) / 3} 0 ${H / 3} 0 0 Z`;

		// End path: top stays straight; sides bow outward then curve sharply inward
		// to a thin sliver at the bottom — the magic-lamp neck.
		const bow = W * 0.08;
		const neckHalf = W * 0.04;
		const endPath =
			`M 0 0 ` +
			`C ${W / 3} 0 ${(2 * W) / 3} 0 ${W} 0 ` +
			`C ${W + bow} ${H * 0.35} ${W / 2 + neckHalf + bow} ${H * 0.85} ${W / 2 + neckHalf} ${H} ` +
			`C ${W / 2 + neckHalf} ${H} ${W / 2 - neckHalf} ${H} ${W / 2 - neckHalf} ${H} ` +
			`C ${W / 2 - neckHalf - bow} ${H * 0.85} ${-bow} ${H * 0.35} 0 0 Z`;

		// Apply start state with no transition, then flip to end state on next frame
		el.style.transition = "none";
		el.style.transformOrigin = "50% 100%";
		el.style.transform = "translate(0, 0) scale(1, 1)";
		el.style.clipPath = `path("${startPath}")`;
		el.style.opacity = "1";
		el.style.pointerEvents = "none";
		// Force reflow so the browser commits the start state
		void el.offsetHeight;

		// Phase 1 (0-65%): mostly the clip-path morph & start of slide
		// Phase 2 (65-100%): finish translating + scaling into dock
		el.style.transition =
			`clip-path ${GENIE_DURATION * 0.7}ms cubic-bezier(0.4, 0, 0.2, 1), ` +
			`transform ${GENIE_DURATION}ms cubic-bezier(0.55, 0.05, 0.85, 0.4), ` +
			`opacity 180ms ease-in ${GENIE_DURATION - 200}ms`;
		el.style.clipPath = `path("${endPath}")`;
		el.style.transform = `translate(${dx}px, ${dy}px) scale(0.05, 0.05)`;
		el.style.opacity = "0";

		setTimeout(onMinimize, GENIE_DURATION);
	};

	useEffect(() => {
		return () => {
			if (frameRef.current) cancelAnimationFrame(frameRef.current);
		};
	}, []);

	const getAnimationStyle = (): CSSProperties => {
		if (animation === "opening") {
			return {
				opacity: 0,
				transform: "scale(0.92) translateY(8px)",
				animation: `windowOpen ${ANIMATION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
			};
		}
		if (animation === "closing") {
			return {
				animation: `windowClose ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 1, 1) forwards`,
				pointerEvents: "none",
			};
		}
		return {};
	};

	const windowStyle: CSSProperties = {
		position: "fixed",
		left: app.maximized ? 0 : app.position.x || 100,
		top: app.maximized ? 0 : app.position.y || 100,
		width: app.maximized ? "100vw" : `${width}px`,
		height: app.maximized ? `calc(100vh - ${TASKBAR_HEIGHT}px)` : `${height}px`,
		zIndex: app.zIndex,
		transition:
			isDragging || resizeDir
				? "none"
				: "left 200ms cubic-bezier(0.4,0,0.2,1), top 200ms cubic-bezier(0.4,0,0.2,1), width 200ms cubic-bezier(0.4,0,0.2,1), height 200ms cubic-bezier(0.4,0,0.2,1)",
		willChange: isDragging || resizeDir ? "transform" : "auto",
		...getAnimationStyle(),
	};

	const AppComponent = app.app;

	return (
		<>
			<style>{`
				@keyframes windowOpen {
					from { opacity: 0; transform: scale(0.92) translateY(8px); }
					to   { opacity: 1; transform: scale(1) translateY(0); }
				}
				@keyframes windowClose {
					from { opacity: 1; transform: scale(1); }
					to   { opacity: 0; transform: scale(0.88); }
				}
			`}</style>

			<div
				ref={elRef}
				className={`bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden ${
					app.maximized ? "rounded-none" : "rounded-xl"
				} ${isDragging ? "shadow-blue-500/20" : ""}`}
				style={windowStyle}
				onPointerDown={onFocus}
			>
				<div
					className={`flex justify-between items-center px-3 py-2 bg-gradient-to-b from-gray-800 to-gray-900 border-b border-white/5 select-none window-header ${
						app.maximized ? "" : "cursor-grab active:cursor-grabbing"
					} touch-none`}
					onPointerDown={handleHeaderPointerDown}
					onPointerMove={handleHeaderPointerMove}
					onPointerUp={stopDragging}
					onPointerCancel={stopDragging}
					onDoubleClick={() => !app.maximized && onMaximize()}
				>
					<div
						className="flex items-center space-x-2"
						onMouseEnter={() => setHoverControls(true)}
						onMouseLeave={() => setHoverControls(false)}
					>
						<button
							type="button"
							onClick={handleCloseAnimated}
							className="flex justify-center items-center w-3 h-3 bg-red-500 rounded-full transition-colors hover:bg-red-400"
							title="Close"
						>
							<svg
								className={`w-2 h-2 text-red-900 transition-opacity ${hoverControls ? "opacity-100" : "opacity-0"}`}
								viewBox="0 0 8 8" fill="none" stroke="currentColor"
								strokeWidth="1.5" strokeLinecap="round"
							>
								<path d="M2 2 L6 6 M6 2 L2 6" />
							</svg>
						</button>
						<button
							type="button"
							onClick={handleMinimizeAnimated}
							className="flex justify-center items-center w-3 h-3 bg-yellow-500 rounded-full transition-colors hover:bg-yellow-400"
							title="Minimize"
						>
							<svg
								className={`w-2 h-2 text-yellow-900 transition-opacity ${hoverControls ? "opacity-100" : "opacity-0"}`}
								viewBox="0 0 8 8" fill="none" stroke="currentColor"
								strokeWidth="1.5" strokeLinecap="round"
							>
								<path d="M1.5 4 L6.5 4" />
							</svg>
						</button>
						<button
							type="button"
							onClick={onMaximize}
							className="flex justify-center items-center w-3 h-3 bg-green-500 rounded-full transition-colors hover:bg-green-400"
							title={app.maximized ? "Restore" : "Maximize"}
						>
							<svg
								className={`w-2 h-2 text-green-900 transition-opacity ${hoverControls ? "opacity-100" : "opacity-0"}`}
								viewBox="0 0 8 8" fill="currentColor"
							>
								<path d="M2 2 L4 2 L2 4 Z M6 6 L4 6 L6 4 Z" />
							</svg>
						</button>
					</div>

					<div className="flex absolute left-1/2 items-center space-x-2 -translate-x-1/2 pointer-events-none">
						<AppIcon name={app.iconName} className="w-3.5 h-3.5" />
						<span className="text-xs font-medium tracking-wide text-white/80">
							{app.title}
						</span>
					</div>
					<div className="w-16" />
				</div>

				<div className="overflow-auto h-[calc(100%-36px)] bg-gray-950">
					<AppComponent id={app.id} />
				</div>

				{!app.maximized && (
					<>
						<div onPointerDown={(e) => handleResizePointerDown(e, "n")} onPointerMove={handleResizePointerMove} onPointerUp={stopResizing} onPointerCancel={stopResizing} className="absolute top-0 right-2 left-2 h-1 cursor-n-resize touch-none" />
						<div onPointerDown={(e) => handleResizePointerDown(e, "s")} onPointerMove={handleResizePointerMove} onPointerUp={stopResizing} onPointerCancel={stopResizing} className="absolute right-2 bottom-0 left-2 h-1 cursor-s-resize touch-none" />
						<div onPointerDown={(e) => handleResizePointerDown(e, "w")} onPointerMove={handleResizePointerMove} onPointerUp={stopResizing} onPointerCancel={stopResizing} className="absolute top-2 bottom-2 left-0 w-1 cursor-w-resize touch-none" />
						<div onPointerDown={(e) => handleResizePointerDown(e, "e")} onPointerMove={handleResizePointerMove} onPointerUp={stopResizing} onPointerCancel={stopResizing} className="absolute top-2 right-0 bottom-2 w-1 cursor-e-resize touch-none" />
						<div onPointerDown={(e) => handleResizePointerDown(e, "nw")} onPointerMove={handleResizePointerMove} onPointerUp={stopResizing} onPointerCancel={stopResizing} className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize touch-none" />
						<div onPointerDown={(e) => handleResizePointerDown(e, "ne")} onPointerMove={handleResizePointerMove} onPointerUp={stopResizing} onPointerCancel={stopResizing} className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize touch-none" />
						<div onPointerDown={(e) => handleResizePointerDown(e, "sw")} onPointerMove={handleResizePointerMove} onPointerUp={stopResizing} onPointerCancel={stopResizing} className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize touch-none" />
						<div onPointerDown={(e) => handleResizePointerDown(e, "se")} onPointerMove={handleResizePointerMove} onPointerUp={stopResizing} onPointerCancel={stopResizing} className="absolute right-0 bottom-0 w-3 h-3 cursor-se-resize touch-none" />
					</>
				)}
			</div>
		</>
	);
};

export { WindowManager };
