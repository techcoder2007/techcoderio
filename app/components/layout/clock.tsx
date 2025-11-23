import { useEffect, useState } from "react";

const Clock = () => {
	const [time, setTime] = useState(new Date());

	const month = time.toLocaleString("default", { month: "short" });
	const date = time.getDate();
	const timeAMPM = time.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(new Date());
		}, 10000);

		return () => clearInterval(intervalId);
	}, []);

	return <div>{`${month} ${date} ${timeAMPM}`}</div>;
};

export { Clock };
