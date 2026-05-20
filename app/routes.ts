import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/error", "routes/error.tsx"),
	route("/playground", "routes/playground.tsx"),
	route("/calendar", "routes/calendar.tsx"),
] satisfies RouteConfig;
