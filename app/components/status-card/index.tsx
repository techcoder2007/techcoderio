import { type FormEvent, useState } from "react";

import {
	AudioVolume,
	Battery,
	Bluetooth,
	Brightness,
	Lock,
	PowerOff,
	Settings,
	Wifi,
} from "~/icons";
import { Accordion } from "../core/accordion";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import {
	setBrightnessLevel,
	setSoundLevel,
} from "~/redux/features/status-slice";
import { Slider } from "../core/slider";
import { Calendar } from "../core/calendar";

interface StatusCardProps {}

const StatusCard = ({}: StatusCardProps) => {
	const dispatch = useAppDispatch();
	const status = useAppSelector((state) => state.status);

	const [wifiEnabled, setWifiEnabled] = useState(true);
	const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
	const [isLocked, setIsLocked] = useState(false);

	const handleSoundChange = (e: FormEvent<HTMLInputElement>) => {
		const value = Number((e.target as HTMLInputElement).value);
		dispatch(setSoundLevel(value));
	};

	const handleBrightnessChange = (e: FormEvent<HTMLInputElement>) => {
		const value = Number((e.target as HTMLInputElement).value);
		dispatch(setBrightnessLevel(Math.max(value, 10)));
	};
	const toggleWifi = () => {
		setWifiEnabled(!wifiEnabled);
	};

	const handleWifiAction = (action: string) => {
		switch (action) {
			case "Select Network":
				console.log("Opening network selection...");
				break;
			case "Power Off":
				toggleWifi();
				break;
			case "Wi-Fi Settings":
				console.log("Opening WiFi settings...");
				break;
		}
	};

	const toggleBluetooth = () => {
		setBluetoothEnabled(!bluetoothEnabled);
	};

	const handleBluetoothAction = (action: string) => {
		switch (action) {
			case "Turn On":
				toggleBluetooth();
				break;
			case "Bluetooth Settings":
				console.log("Opening Bluetooth settings...");
				break;
		}
	};

	const handlePowerAction = (action: string) => {
		switch (action) {
			case "Suspend":
				console.log("Suspending system...");
				break;
			case "Restart...":
				console.log("Restarting system...");
				break;
			case "Power Off":
				console.log("Shutting down system...");
				break;
			case "Log Out":
				console.log("Logging out...");
				break;
		}
	};
	const handleLock = () => {
		setIsLocked(true);
		console.log("System locked");
		// In a real app, you might want to navigate to a lock screen
	};

	const handleSettings = () => {
		console.log("Opening system settings...");
	};

	const getBatteryStatus = () => {
		const batteryLevel = 80;
		const estimatedTime = "2:55";
		return `${estimatedTime} Remaining (${batteryLevel}%)`;
	};

	return (
		<div className="absolute right-0 top-8 w-72 rounded-md border border-black border-opacity-20 bg-gray-900 p-1.5 shadow">
			<Calendar selected={new Date()} className="w-full" />
			<div className="flex items-center gap-2 rounded-sm p-2 hover:bg-slate-800">
				<AudioVolume />
				<Slider
					onChange={handleSoundChange}
					value={status.soundLevel}
					min={0}
					max={100}
				/>
				<span className="text-xs text-gray-400 w-8">
					{Math.round(status.soundLevel)}%
				</span>
			</div>

			<div className="flex items-center gap-2 rounded-sm p-2 hover:bg-slate-800">
				<Brightness />
				<Slider
					onChange={handleBrightnessChange}
					value={status.brightnessLevel}
					min={10}
					max={100}
				/>
				<span className="text-xs text-gray-400 w-8">
					{Math.round(status.brightnessLevel)}%
				</span>
			</div>

			<hr className="my-2 h-px border-0 bg-gray-700" />

			<div className="flex flex-col">
				<Accordion
					title={`${wifiEnabled ? "TechCoder's Wifi" : "Off"}`}
					icon={<Wifi />}
				>
					<div className="">
						<p
							className="p-1 px-5 hover:bg-slate-700 cursor-pointer"
							onClick={() => handleWifiAction("Select Network")}
						>
							Select Network
						</p>
						<p
							className="p-1 px-5 hover:bg-slate-700 cursor-pointer"
							onClick={() => handleWifiAction("Power Off")}
						>
							{wifiEnabled ? "Power Off" : "Turn On"}
						</p>
						<p
							className="p-1 px-5 hover:bg-slate-700 cursor-pointer"
							onClick={() => handleWifiAction("Wi-Fi Settings")}
						>
							Wi-Fi Settings
						</p>
					</div>
				</Accordion>

				<Accordion title={bluetoothEnabled ? "On" : "Off"} icon={<Bluetooth />}>
					<div className="">
						<p
							className="p-1 px-5 hover:bg-slate-700 cursor-pointer"
							onClick={() =>
								handleBluetoothAction(
									bluetoothEnabled ? "Bluetooth Settings" : "Turn On",
								)
							}
						>
							{bluetoothEnabled ? "Bluetooth Settings" : "Turn On"}
						</p>
					</div>
				</Accordion>

				<Accordion title={getBatteryStatus()} icon={<Battery />}>
					<div className="">
						<p className="p-1 px-5 hover:bg-slate-700 cursor-pointer">
							Power Settings
						</p>
					</div>
				</Accordion>
			</div>

			<hr className="my-2 h-px border-0 bg-gray-700" />

			<div
				className="flex items-center gap-2 rounded-sm p-2 hover:bg-slate-800 cursor-pointer"
				onClick={handleSettings}
			>
				<Settings />
				Settings
			</div>

			<div
				className="flex items-center gap-2 rounded-sm p-2 hover:bg-slate-800 cursor-pointer"
				onClick={handleLock}
			>
				<Lock />
				Lock
			</div>

			<div className="flex flex-col">
				<Accordion title="Power Off / Log Out" icon={<PowerOff />}>
					<div className="">
						<p
							className="p-1 px-5 hover:bg-slate-700 cursor-pointer"
							onClick={() => handlePowerAction("Suspend")}
						>
							Suspend
						</p>
						<p
							className="p-1 px-5 hover:bg-slate-700 cursor-pointer"
							onClick={() => handlePowerAction("Restart...")}
						>
							Restart...
						</p>
						<p
							className="p-1 px-5 hover:bg-slate-700 cursor-pointer"
							onClick={() => handlePowerAction("Power Off")}
						>
							Power Off
						</p>
						<hr className="my-2 h-px border-0 bg-gray-700" />
						<p
							className="p-1 px-5 hover:bg-slate-700 cursor-pointer"
							onClick={() => handlePowerAction("Log Out")}
						>
							Log Out
						</p>
					</div>
				</Accordion>
			</div>
		</div>
	);
};

export { StatusCard };
