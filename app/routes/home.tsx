import Welcome from "~/views/welcome";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "TechCoder.io" },
		{ name: "description", content: "Portfolio of TechCoder.io" },
	];
}

export default function Home() {
	return <Welcome />;
}
