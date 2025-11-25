import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import { Grid3X3, Monitor, Smile, Square, Terminal, Undo } from "lucide-react";

import type { Route } from "./+types/root";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "./components/context-menu";
import { Providers } from "./redux/provider";
import "./styles/app.css";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href:
			"https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="dark">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<Providers>
			<ContextMenu>
				<ContextMenuTrigger className="w-full h-full">
					<Outlet />
				</ContextMenuTrigger>
				<ContextMenuContent className="w-64">
					<ContextMenuSub>
						<ContextMenuSubTrigger className="flex items-center gap-2">
							<Monitor className="h-4 w-4" />
							View
						</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<ContextMenuRadioGroup value="medium">
								<ContextMenuRadioItem value="large">
									<Grid3X3 className="h-4 w-4 mr-2" />
									Large icons
								</ContextMenuRadioItem>
								<ContextMenuRadioItem value="medium">
									<Square className="h-4 w-4 mr-2" />
									Medium icons
								</ContextMenuRadioItem>
								<ContextMenuRadioItem value="small">
									<Smile className="h-4 w-4 mr-2" />
									Small icons
								</ContextMenuRadioItem>
							</ContextMenuRadioGroup>
						</ContextMenuSubContent>
					</ContextMenuSub>

					{/* Personalize */}
					<ContextMenuItem className="flex items-center gap-2">
						<Monitor className="h-4 w-4" />
						Personalize
					</ContextMenuItem>

					<ContextMenuSeparator />

					{/* Open in Terminal */}
					<ContextMenuItem className="flex items-center gap-2">
						<Terminal className="h-4 w-4" />
						Open in Terminal
					</ContextMenuItem>

					<ContextMenuSeparator />

					{/* Undo Delete */}
					<ContextMenuItem className="flex items-center gap-2">
						<Undo className="h-4 w-4" />
						Undo Delete
					</ContextMenuItem>

					<ContextMenuSeparator />

					<ContextMenuItem inset>
						Back
						<ContextMenuShortcut>⌘[</ContextMenuShortcut>
					</ContextMenuItem>
					<ContextMenuItem inset disabled>
						Forward
						<ContextMenuShortcut>⌘]</ContextMenuShortcut>
					</ContextMenuItem>
					<ContextMenuItem inset>
						Reload
						<ContextMenuShortcut>⌘R</ContextMenuShortcut>
					</ContextMenuItem>

					<ContextMenuSeparator />
				</ContextMenuContent>
			</ContextMenu>
		</Providers>
	);
}
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
