import { biomePlugin } from "@pbr1111/vite-plugin-biome";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	// redux-persist uses directory imports that Node ESM cannot resolve at runtime
	ssr: { noExternal: ["redux-persist"] },
	plugins: [
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
		biomePlugin({ path: "app" }),
	],
});
