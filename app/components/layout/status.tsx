import { AudioVolume, Battery, Wifi } from "~/icons";

const Status = () => {
	return (
		<div className="flex items-center gap-2">
			<Wifi />
			<AudioVolume />
			<Battery />
			<div>80 %</div>
		</div>
	);
};

export { Status };
