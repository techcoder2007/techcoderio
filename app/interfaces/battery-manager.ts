export interface BatteryManager extends EventTarget {
	readonly level: number;
	readonly charging: boolean;
	readonly chargingTime: number;
	readonly dischargingTime: number;
	onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
	onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
	onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
	ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
}

export interface NavigatorWithBattery extends Navigator {
	getBattery?: () => Promise<BatteryManager>;
}
