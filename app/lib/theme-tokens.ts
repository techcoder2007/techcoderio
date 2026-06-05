import type { AccentColor, FontFamily } from "~/redux/features/settings-slice";

export const ACCENT_COLORS: Record<
	AccentColor,
	{ hex: string; label: string }
> = {
	ubuntu: { hex: "#e95420", label: "Ubuntu Orange" },
	blue: { hex: "#3584e4", label: "GNOME Blue" },
	green: { hex: "#2fb551", label: "Mint Green" },
	purple: { hex: "#8b5cf6", label: "Purple" },
	red: { hex: "#e01b24", label: "Red" },
	teal: { hex: "#00bcd4", label: "Teal" },
};

export const FONT_FAMILIES: Record<
	FontFamily,
	{ stack: string; label: string }
> = {
	"noto-mono": {
		stack: '"Noto Sans Mono", ui-monospace, monospace',
		label: "Noto Sans Mono",
	},
	system: {
		stack: "ui-sans-serif, system-ui, sans-serif",
		label: "System Default",
	},
	ubuntu: { stack: '"Ubuntu", ui-sans-serif, sans-serif', label: "Ubuntu" },
	cantarell: {
		stack: '"Cantarell", ui-sans-serif, sans-serif',
		label: "Cantarell",
	},
	dejavu: {
		stack: '"DejaVu Sans", ui-sans-serif, sans-serif',
		label: "DejaVu Sans",
	},
	liberation: {
		stack: '"Liberation Sans", Arial, ui-sans-serif, sans-serif',
		label: "Liberation Sans",
	},
};
