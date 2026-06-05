const registry = new Map<string, HTMLElement>();

export const dockRegistry = {
	register(appId: string, el: HTMLElement) {
		registry.set(appId, el);
	},
	unregister(appId: string) {
		registry.delete(appId);
	},
	getRect(appId: string): DOMRect | null {
		const el = registry.get(appId);
		return el ? el.getBoundingClientRect() : null;
	},
};
