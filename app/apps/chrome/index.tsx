import { useState } from "react";
import { Home, Refresh } from "~/icons";

const WEB_URL = "https://www.google.com/webhp?igu=1";

interface ChromeProps {
	id?: string;
}

const Chrome = (_props: ChromeProps) => {
	const [siteUrl, setSiteUrl] = useState<string>(WEB_URL);

	const onRefresh = () => {
		setSiteUrl(WEB_URL);
	};

	const onHome = () => {
		setSiteUrl(WEB_URL);
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex gap-2 items-center w-full h-8 bg-zinc-700">
				<div className="flex gap-2">
					<Refresh
						className="p-0 h-5 rounded-full hover:bg-zinc-800"
						onClick={onRefresh}
					/>
					<Home
						className="p-0 h-5 rounded-full hover:bg-zinc-800"
						onClick={onHome}
					/>
				</div>
				<input
					className="px-2 w-10/12 h-6 text-sm text-gray-300 rounded-3xl outline-none bg-zinc-900 focus:text-white"
					value={siteUrl}
					onChange={(e) => setSiteUrl(e.target.value)}
				/>
			</div>
			<div className="grow">
				<iframe
					title="Google"
					src={siteUrl}
					frameBorder="0"
					width="100%"
					height="100%"
					allowFullScreen
				></iframe>
			</div>
		</div>
	);
};

export { Chrome };
