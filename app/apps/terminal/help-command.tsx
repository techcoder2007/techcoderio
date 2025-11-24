import type { ReactNode } from "react";

export const HelpCommand = (): ReactNode => (
	<div className="whitespace-pre-wrap">
		<span className="text-green-500">Available commands:</span>
		<br />
		<span className="text-yellow-500">help</span> - List available commands
		<br />
		<span className="text-yellow-500">ls</span> - List directory contents
		<br />
		<span className="text-yellow-500">ls -l</span> - List directory contents in
		long format
		<br />
		<span className="text-yellow-500">clear</span> - Clear the terminal
		<br />
		<span className="text-yellow-500">exit</span> - Close the terminal
		<br />
		<span className="text-yellow-500">pwd</span> - Print name of current working
		directory
		<br />
		<span className="text-yellow-500">whoami</span> - Print effective userid
		<br />
		<span className="text-yellow-500">echo</span> - Echo the input
		<br />
		<span className="text-yellow-500">code</span> - Open Visual Studio Code
		<br />
		<span className="text-yellow-500">cd</span> - Change the current directory
		<br />
		<span className="text-yellow-500">calc</span> - Perform basic mathematical
		operations
		<br />
		<span className="text-yellow-500">js</span> - Execute JavaScript expressions
		<br />
		<span className="text-yellow-500">math</span> - Perform mathematical
		operations (alias for calc)
	</div>
);
