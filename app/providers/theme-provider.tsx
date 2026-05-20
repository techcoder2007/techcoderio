import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ACCENT_COLORS, FONT_FAMILIES } from "~/lib/theme-tokens";
import type { RootState } from "~/redux/reducers";

export function ThemeProvider() {
	const { theme, accentColor, fontFamily } = useSelector((s: RootState) => s.settings);

	useEffect(() => {
		const root = document.documentElement;

		if (theme === "dark") {
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
		}

		root.style.setProperty("--app-accent", ACCENT_COLORS[accentColor].hex);
		root.style.setProperty("--font-sans", FONT_FAMILIES[fontFamily].stack);
	}, [theme, accentColor, fontFamily]);

	return null;
}
