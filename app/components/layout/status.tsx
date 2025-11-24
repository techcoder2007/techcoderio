import { AudioVolume, Wifi } from "~/icons";
import BatteryIndicator from "./battery-indicator";

const Status = () => {
	return (
		<div className="flex items-center gap-2">
			<Wifi />
			<AudioVolume />
			<BatteryIndicator />
		</div>
	);
};

export { Status };
