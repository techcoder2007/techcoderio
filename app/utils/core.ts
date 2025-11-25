import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const closeWindow = (): boolean => {
	if (typeof window === "undefined") return false;

	try {
		if (window.opener) {
			// For popup windows
			window.close();
			return true;
		} else {
			// For the main window, we can only close it if it was opened by JavaScript
			const newWindow = window.open("", "_self");
			if (newWindow) {
				newWindow.close();
				return true;
			}
		}
	} catch (error) {
		console.warn("Could not close the window:", error);
	}

	// If we got here, we couldn't close the window
	console.warn(
		"Could not close the window: Not allowed by browser security policy",
	);
	return false;
};
