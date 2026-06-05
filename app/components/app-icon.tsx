import type { CSSProperties } from "react";
import type { AppIconName } from "~/redux/features/all-apps-slice";

interface AppIconProps {
	name: AppIconName;
	className?: string;
	style?: CSSProperties;
	strokeWidth?: number;
}

const AppIcon = ({ name, className, style }: AppIconProps) => {
	switch (name) {
		case "chrome":
			return (
				<svg viewBox="0 0 64 64" className={className} style={style}>
					<defs>
						<linearGradient id="chr-red" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0" stopColor="#EA4335" />
							<stop offset="1" stopColor="#C5221F" />
						</linearGradient>
						<linearGradient id="chr-yel" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0" stopColor="#FDD663" />
							<stop offset="1" stopColor="#F9AB00" />
						</linearGradient>
						<linearGradient id="chr-grn" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#34A853" />
							<stop offset="1" stopColor="#188038" />
						</linearGradient>
						<radialGradient id="chr-blu" cx="0.5" cy="0.4" r="0.6">
							<stop offset="0" stopColor="#669DF6" />
							<stop offset="1" stopColor="#1A73E8" />
						</radialGradient>
					</defs>
					<circle cx="32" cy="32" r="30" fill="#fff" />
					<path
						d="M32 4 A28 28 0 0 1 56.25 18 L42 26.5 A14 14 0 0 0 32 18 Z"
						fill="url(#chr-red)"
					/>
					<path
						d="M56.25 18 A28 28 0 0 1 49 50 L37 38 A14 14 0 0 0 42 26.5 Z"
						fill="url(#chr-yel)"
					/>
					<path
						d="M49 50 A28 28 0 0 1 7.75 18 L22 26.5 A14 14 0 0 0 27 38 Z"
						fill="url(#chr-grn)"
					/>
					<circle cx="32" cy="32" r="12" fill="url(#chr-blu)" />
					<circle
						cx="32"
						cy="32"
						r="12"
						fill="none"
						stroke="rgba(0,0,0,0.1)"
						strokeWidth="0.5"
					/>
				</svg>
			);

		case "code":
			return (
				<svg viewBox="0 0 64 64" className={className} style={style}>
					<defs>
						<linearGradient id="vsc-bg" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#23A9F2" />
							<stop offset="1" stopColor="#0066B8" />
						</linearGradient>
						<mask id="vsc-mask">
							<rect width="64" height="64" rx="12" fill="white" />
						</mask>
					</defs>
					<g mask="url(#vsc-mask)">
						<rect width="64" height="64" rx="12" fill="url(#vsc-bg)" />
						<path
							d="M46 12 L52 16 L52 48 L46 52 L26 36 L18 44 L12 40 L12 24 L18 20 L26 28 L46 12 Z"
							fill="#fff"
							opacity="0.95"
						/>
						<path
							d="M46 12 L52 16 L52 48 L46 52 L26 36 Z"
							fill="rgba(255,255,255,0.3)"
						/>
						<path d="M18 20 L26 28 L18 44 L12 40 L12 24 Z" fill="rgba(0,0,0,0.15)" />
					</g>
				</svg>
			);

		case "terminal":
			return (
				<svg viewBox="0 0 64 64" className={className} style={style}>
					<defs>
						<linearGradient id="trm-bg" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#3D3D3D" />
							<stop offset="1" stopColor="#1A1A1A" />
						</linearGradient>
					</defs>
					<rect width="64" height="64" rx="12" fill="url(#trm-bg)" />
					<rect
						x="4"
						y="4"
						width="56"
						height="14"
						rx="8"
						fill="rgba(255,255,255,0.06)"
					/>
					<circle cx="12" cy="11" r="2" fill="#FF5F57" />
					<circle cx="20" cy="11" r="2" fill="#FEBC2E" />
					<circle cx="28" cy="11" r="2" fill="#28C840" />
					<path
						d="M14 30 L22 38 L14 46"
						fill="none"
						stroke="#5EFF7A"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<rect x="26" y="44" width="20" height="3" rx="1.5" fill="#5EFF7A" />
				</svg>
			);

		case "spotify":
			return (
				<svg viewBox="0 0 64 64" className={className} style={style}>
					<defs>
						<radialGradient id="spt-bg" cx="0.3" cy="0.3" r="0.9">
							<stop offset="0" stopColor="#1ED760" />
							<stop offset="1" stopColor="#0F9143" />
						</radialGradient>
					</defs>
					<circle cx="32" cy="32" r="30" fill="url(#spt-bg)" />
					<path
						d="M16 24 Q32 18 48 26"
						stroke="#000"
						strokeWidth="4.5"
						strokeLinecap="round"
						fill="none"
					/>
					<path
						d="M18 33 Q32 28 45 35"
						stroke="#000"
						strokeWidth="3.8"
						strokeLinecap="round"
						fill="none"
					/>
					<path
						d="M20 41 Q32 37 43 43"
						stroke="#000"
						strokeWidth="3"
						strokeLinecap="round"
						fill="none"
					/>
				</svg>
			);

		case "calculator":
			return (
				<svg viewBox="0 0 64 64" className={className} style={style}>
					<defs>
						<linearGradient id="calc-bg" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#3A3A3C" />
							<stop offset="1" stopColor="#1C1C1E" />
						</linearGradient>
					</defs>
					<rect width="64" height="64" rx="12" fill="url(#calc-bg)" />
					<rect x="8" y="8" width="48" height="14" rx="3" fill="#0D0D0D" />
					<text
						x="52"
						y="19"
						textAnchor="end"
						fill="#fff"
						fontSize="11"
						fontFamily="ui-monospace, monospace"
						fontWeight="300"
					>
						1,024
					</text>
					{/* Number pad */}
					{[0, 1, 2, 3].map((row) =>
						[0, 1, 2].map((col) => (
							<rect
								key={`n-${row}-${col}`}
								x={8 + col * 11}
								y={26 + row * 8.5}
								width="9"
								height="6.5"
								rx="2"
								fill="#505050"
							/>
						)),
					)}
					{/* Operator column (orange) */}
					{[0, 1, 2, 3].map((row) => (
						<rect
							key={`op-${row}`}
							x="41"
							y={26 + row * 8.5}
							width="15"
							height="6.5"
							rx="2"
							fill="#FF9500"
						/>
					))}
				</svg>
			);

		case "calendar":
			return (
				<svg viewBox="0 0 64 64" className={className} style={style}>
					<defs>
						<linearGradient id="cal-bg" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#4f8cff" />
							<stop offset="1" stopColor="#2c4bd6" />
						</linearGradient>
						<linearGradient id="cal-page" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#ffffff" />
							<stop offset="1" stopColor="#dbe7ff" />
						</linearGradient>
					</defs>
					<rect width="64" height="64" rx="14" fill="url(#cal-bg)" />
					<rect x="12" y="15" width="40" height="38" rx="6" fill="url(#cal-page)" />
					<rect x="12" y="15" width="40" height="12" rx="6" fill="#ff5f57" />
					<path d="M12 23h40v6H12z" fill="#ff5f57" />
					<rect x="21" y="9" width="4" height="12" rx="2" fill="#f8fbff" />
					<rect x="39" y="9" width="4" height="12" rx="2" fill="#f8fbff" />
					{[0, 1, 2].map((row) =>
						[0, 1, 2, 3].map((col) => (
							<rect
								key={`cal-${row}-${col}`}
								x={18 + col * 8}
								y={33 + row * 6}
								width="4"
								height="3.5"
								rx="1"
								fill={row === 1 && col === 2 ? "#2c4bd6" : "#8aa0c8"}
								opacity={row === 1 && col === 2 ? 1 : 0.75}
							/>
						)),
					)}
				</svg>
			);

		case "files":
			return (
				<svg viewBox="0 0 64 64" className={className} style={style}>
					<defs>
						<linearGradient id="fil-bg" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#3a8fd4" />
							<stop offset="1" stopColor="#1a5fa8" />
						</linearGradient>
						<linearGradient id="fil-folder" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#ffd04b" />
							<stop offset="1" stopColor="#f0a500" />
						</linearGradient>
					</defs>
					<rect width="64" height="64" rx="14" fill="url(#fil-bg)" />
					{/* Back folder */}
					<path
						d="M10 22 Q10 18 14 18 L26 18 L28 22 L50 22 Q54 22 54 26 L54 46 Q54 50 50 50 L14 50 Q10 50 10 46 Z"
						fill="#c07800"
						opacity="0.7"
					/>
					{/* Front folder */}
					<path
						d="M10 28 Q10 24 14 24 L28 24 L30 28 L52 28 Q56 28 56 32 L56 50 Q56 54 52 54 L12 54 Q8 54 8 50 L8 32 Q8 28 10 28 Z"
						fill="url(#fil-folder)"
					/>
					{/* Document lines */}
					<rect
						x="16"
						y="36"
						width="16"
						height="2.5"
						rx="1.25"
						fill="rgba(0,0,0,0.25)"
					/>
					<rect
						x="16"
						y="41"
						width="24"
						height="2.5"
						rx="1.25"
						fill="rgba(0,0,0,0.25)"
					/>
					<rect
						x="16"
						y="46"
						width="10"
						height="2.5"
						rx="1.25"
						fill="rgba(0,0,0,0.25)"
					/>
				</svg>
			);

		case "settings":
			return (
				<svg viewBox="0 0 64 64" className={className} style={style}>
					<defs>
						<linearGradient id="set-bg" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#5a5a6e" />
							<stop offset="1" stopColor="#2c2c3a" />
						</linearGradient>
					</defs>
					<rect width="64" height="64" rx="14" fill="url(#set-bg)" />
					{/* Outer gear ring */}
					<path
						d="M32 10 l3.5 4.5 5.5-1 2 5.3 5.5 1.2-0.5 5.6 4.8 2.8-2.5 5 3 4.5-4 3.8 1.2 5.5-5.3 1.5-1.5 5.4-5.6-0.3-3.1 4.7-5-2.3-4.5 3.5-4.2-3.8-5.4 1.8-2.2-5-5.6-0.5 0.2-5.6-4.5-3.3 2.8-5-2.2-5.2 4.8-2.5-0.8-5.6 5.5-1 1.8-5.3 5.5 0.8Z"
						fill="rgba(255,255,255,0.12)"
					/>
					{/* Gear body */}
					<circle cx="32" cy="32" r="10" fill="rgba(255,255,255,0.85)" />
					<circle cx="32" cy="32" r="5" fill="url(#set-bg)" />
					{/* Gear teeth */}
					{[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
						const rad = (deg * Math.PI) / 180;
						const x1 = 32 + 13 * Math.cos(rad);
						const y1 = 32 + 13 * Math.sin(rad);
						const x2 = 32 + 17 * Math.cos(rad);
						const y2 = 32 + 17 * Math.sin(rad);
						return (
							<line
								key={deg}
								x1={x1}
								y1={y1}
								x2={x2}
								y2={y2}
								stroke="rgba(255,255,255,0.85)"
								strokeWidth="4"
								strokeLinecap="round"
							/>
						);
					})}
				</svg>
			);

		case "ubuntu-logo":
			return (
				<svg viewBox="0 0 64 64" className={className} style={style}>
					<circle cx="32" cy="32" r="30" fill="#E95420" />
					<circle cx="32" cy="14" r="5" fill="#fff" />
					<circle cx="16" cy="42" r="5" fill="#fff" />
					<circle cx="48" cy="42" r="5" fill="#fff" />
					<circle
						cx="32"
						cy="32"
						r="22"
						fill="none"
						stroke="rgba(255,255,255,0.3)"
						strokeWidth="2"
					/>
				</svg>
			);

		default:
			return null;
	}
};

export { AppIcon };
