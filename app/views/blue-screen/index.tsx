import React, { useEffect, useRef, useState } from "react";
import windowsErrorQR from "~/assets/images/windows-error-QR.svg";

type Props = {
	initialProgress?: number;
	stopCode?: string;
};

const BlueScreen: React.FC<Props> = ({
	initialProgress = 0,
	stopCode = "CRITICAL_PROCESS_DIED",
}) => {
	const [progress, setProgress] = useState<number>(
		Math.max(0, Math.min(100, Math.round(initialProgress))),
	);
	const mounted = useRef(true);

	useEffect(() => {
		mounted.current = true;
		// increase every 700ms by a small random amount, stop at 100
		const id = setInterval(() => {
			setProgress((p) => {
				if (!mounted.current) return p;
				if (p >= 100) {
					clearInterval(id);
					return 100;
				}
				// small random increments (1-8) to feel realistic
				const next = p + (1 + Math.floor(Math.random() * 8));
				return next > 100 ? 100 : next;
			});
		}, 700);

		return () => {
			mounted.current = false;
			clearInterval(id);
		};
	}, []);

	return (
		<div
			role="dialog"
			aria-labelledby="bsod-title"
			className="fixed inset-0 z-50 flex items-center justify-center bg-[#0078D7] text-white antialiased"
			style={{
				fontFamily:
					"'Segoe UI', Roboto, system-ui, -apple-system, 'Helvetica Neue', Arial",
			}}
		>
			<div className="max-w-5xl w-[92%] md:w-4/5 lg:w-3/5">
				<div className="flex flex-col md:flex-row gap-8 items-start">
					<div className="flex-1">
						<h1
							id="bsod-title"
							className="text-7xl md:text-8xl mb-8 leading-none font-light"
						>
							:(
						</h1>

						<h2 className="text-xl md:text-2xl font-normal leading-tight max-w-2xl">
							Your PC ran into a problem and needs to restart. We&apos;re just
							collecting some error info, and then we&apos;ll restart for you.
						</h2>

						<div className="mt-6 flex items-center gap-4">
							<div aria-live="polite" className="text-base md:text-lg font-normal">
								{progress}% complete
							</div>
						</div>

						<div className="mt-8 text-sm md:text-base">
							<div className="mb-2">
								For more information about this issue and possible fixes, visit
								<span className="ml-1 font-medium underline cursor-pointer">
									https://support.techco.uz
								</span>
							</div>

							<div className="mt-2">
								<span className="font-mono text-sm md:text-base">{stopCode}</span>
							</div>
						</div>
					</div>

					<div className="shrink-0 flex flex-col items-center gap-4">
						<img
							src={windowsErrorQR}
							alt="Windows error QR"
							width={140}
							height={140}
							className="block"
						/>
						<div className="text-sm text-white/95 max-w-48 text-center">
							If you call support, give them this info.
						</div>
					</div>
				</div>

				<div className="mt-12 text-sm text-white/90">
					<div className="md:ml-0">
						Collecting data for crash dump:{" "}
						<span className="font-mono">{progress}%</span>
					</div>
					<div className="mt-2 text-xs text-white/70">
						<span className="font-mono">0x00000000</span> — {stopCode}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlueScreen;
