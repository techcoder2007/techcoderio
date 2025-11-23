import { useCallback, useRef, useState, type RefObject } from "react";
import useOutsideClickHandler from "~/hooks/use-outside-click-handler";
import { Clock } from "./layout/clock";
import { Status } from "./layout/status";
import { StatusCard } from "./status-card";

interface NavbarProps {}

const Navbar = ({}: NavbarProps) => {
	const [status, setStatus] = useState<boolean>(false);

	const toggleStatus = useCallback(() => {
		setStatus((prev) => !prev);
	}, []);

	const dropdownRef = useRef<HTMLDivElement | null>(null);

	useOutsideClickHandler(dropdownRef as RefObject<HTMLDivElement>, () => {
		setStatus(false);
	});

	return (
		<div className="relative z-50 flex select-none items-center justify-between bg-gray-950 p-1.5 text-sm text-white">
			<div className="px-2 hover:rounded-full hover:bg-gray-800">Activities</div>
			<div className="cursor-pointer px-2 hover:rounded-full hover:bg-gray-800">
				<Clock />
			</div>
			<div
				className="relative cursor-pointer px-2 hover:rounded-full hover:bg-gray-800"
				ref={dropdownRef}
			>
				<div onClick={toggleStatus}>
					<Status />
				</div>
				{status && <StatusCard />}
			</div>
		</div>
	);
};

export { Navbar };
