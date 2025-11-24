import {
	type ChangeEvent,
	Fragment,
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useState,
} from "react";
import { Command, Directory } from "~/enums/terminal";
import { closeApp, openAppByTitle } from "~/redux/features/all-apps-slice";
import { useAppDispatch } from "~/redux/hooks";

interface TerminalProps {
	id: string;
}

interface TerminalRow {
	text: string;
	focused: boolean;
	disabled: boolean;
	response?: ReactNode;
	directory: string;
}

interface CommandResponse {
	response: ReactNode;
	directory: string;
}

const Terminal = ({ id }: TerminalProps) => {
	const dispatch = useAppDispatch();
	const [currentDirectory, setCurrentDirectory] = useState<string>("");
	const [terminalRows, setTerminalRows] = useState<TerminalRow[]>([
		{
			text: "",
			focused: true,
			disabled: false,
			response: (
				<div className="text-gray-400 italic">
					Enter "help" command to know what commands are available in this terminal
				</div>
			),
			directory: "",
		},
	]);

	const handleDirectoryChange = useCallback((directory: string): string => {
		const directories = Object.values(Directory);
		
		if (directory === "" || directory === "..") {
			return "";
		} else if (directories.includes(directory as Directory)) {
			return `/${directory}`;
		}
		return "";
	}, []);

	const handleResponse = useCallback((text: string): CommandResponse => {
		const trimmedText = text.trim();
		const [command, ...args] = trimmedText.split(" ");
		const fullCommand = `${command} ${args.join(" ")}`.trim();

		if (trimmedText === "") {
			return { response: "", directory: currentDirectory };
		}

		if (trimmedText === Command.EXIT) {
			dispatch(closeApp(id));
			return { response: "", directory: currentDirectory };
		}

		if (trimmedText === Command.CLEAR) {
			return { response: "", directory: currentDirectory };
		}

		if (command === Command.CD) {
			if (args.length === 0) {
				return {
					response: "cd: missing operand",
					directory: currentDirectory,
				};
			}
			
			const newDirectory = handleDirectoryChange(args[0]);
			if (newDirectory === "" && args[0] !== ".." && args[0] !== "") {
				return {
					response: `cd: ${args[0]}: No such file or directory`,
					directory: currentDirectory,
				};
			}
			
			setCurrentDirectory(newDirectory);
			return { response: "", directory: newDirectory };
		}

		if (fullCommand === Command.LS) {
			return {
				response: (
					<div className="whitespace-pre-wrap">
						{Object.values(Directory)
							.filter(dir => dir !== "")
							.map((dir, index) => (
								<Fragment key={dir}>
									<span className="text-yellow-500">{dir}</span>
									{index < Object.values(Directory).length - 2 && " "}
								</Fragment>
							))}
					</div>
				),
				directory: currentDirectory,
			};
		}

		if (fullCommand === Command.LS_LONG) {
			return {
				response: (
					<div className="whitespace-pre-wrap">
						<span>total 0</span>
						<br />
						{Object.values(Directory)
							.filter(dir => dir !== "")
							.map(dir => (
								<Fragment key={dir}>
									<span className="text-green-500">drwxr-xr-x</span> 2 techcoderio techcoderio
									4096 Jul 1 10:00 <span className="text-yellow-500">{dir}</span>
									<br />
								</Fragment>
							))}
					</div>
				),
				directory: currentDirectory,
			};
		}

		if (trimmedText === Command.PWD) {
			return {
				response: `/home/techcoderio${currentDirectory}`,
				directory: currentDirectory,
			};
		}

		if (trimmedText === Command.WHOAMI) {
			return {
				response: "techcoderio",
				directory: currentDirectory,
			};
		}

		if (trimmedText === Command.HELP) {
			return {
				response: (
					<div className="whitespace-pre-wrap">
						<span className="text-green-500">Available commands:</span>
						<br />
						<span className="text-yellow-500">help</span> - List available commands
						<br />
						<span className="text-yellow-500">ls</span> - List directory contents
						<br />
						<span className="text-yellow-500">ls -l</span> - List directory contents in long format
						<br />
						<span className="text-yellow-500">clear</span> - Clear the terminal
						<br />
						<span className="text-yellow-500">exit</span> - Close the terminal
						<br />
						<span className="text-yellow-500">pwd</span> - Print name of current working directory
						<br />
						<span className="text-yellow-500">whoami</span> - Print effective userid
						<br />
						<span className="text-yellow-500">echo</span> - Echo the input
						<br />
						<span className="text-yellow-500">code</span> - Open Visual Studio Code
						<br />
						<span className="text-yellow-500">cd</span> - Change the current directory
						<br />
						<span className="text-yellow-500">calc</span> - Perform basic mathematical operations
						<br />
						<span className="text-yellow-500">js</span> - Execute JavaScript expressions
					</div>
				),
				directory: currentDirectory,
			};
		}

		if (command === Command.ECHO) {
			return {
				response: args.join(" "),
				directory: currentDirectory,
			};
		}

		if (trimmedText === Command.CODE) {
			dispatch(openAppByTitle("code"));
			return {
				response: "Opening Visual Studio Code...",
				directory: currentDirectory,
			};
		}

		if (command === "calc") {
			try {
				const expression = args.join("");
				if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
					return {
						response: "Error: Only basic mathematical operations are allowed",
						directory: currentDirectory,
					};
				}
				const result = eval(expression);
				return {
					response: result.toString(),
					directory: currentDirectory,
				};
			} catch (error) {
				return {
					response: "Error: Invalid mathematical expression",
					directory: currentDirectory,
				};
			}
		}

		if (command === "js") {
			try {
				const jsCode = args.join(" ");
				if (/(fetch|XMLHttpRequest|document|window|localStorage|eval|Function|setTimeout|setInterval)/i.test(jsCode)) {
					return {
						response: "Error: This JavaScript operation is not allowed for security reasons",
						directory: currentDirectory,
					};
				}
				
				const result = eval(jsCode);
				return {
					response: JSON.stringify(result, null, 2),
					directory: currentDirectory,
				};
			} catch (error) {
				return {
					response: `Error: ${(error as Error).message}`,
					directory: currentDirectory,
				};
			}
		}

		// Handle unknown commands
		return {
			response: `Command '${trimmedText}' not found, or not yet implemented.`,
			directory: currentDirectory,
		};
	}, [currentDirectory, dispatch, handleDirectoryChange, id]);

	// Optimized event handlers
	const onChange = useCallback((e: ChangeEvent<HTMLInputElement>, index: number) => {
		setTerminalRows(prev => prev.map((row, i) => 
			i === index ? { ...row, text: e.target.value } : row
		));
	}, []);

	const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>, index: number) => {
		if (e.key === "Enter") {
			setTerminalRows(prev => {
				const newRows = prev.map((row, i) => 
					i === index ? { ...row, disabled: true, focused: false } : row
				);
				
				const text = prev[index].text.trim();
				
				if (text === Command.CLEAR) {
					return [{
						text: "",
						focused: true,
						disabled: false,
						directory: currentDirectory,
					}];
				} else if (text === Command.EXIT) {
					dispatch(closeApp(id));
					return newRows;
				} else {
					const response = handleResponse(text);
					const updatedRows = newRows.map((row, i) => 
						i === index ? { ...row, response: response.response } : row
					);
					
					updatedRows.push({
						text: "",
						focused: true,
						disabled: false,
						directory: response.directory,
					});
					
					return updatedRows;
				}
			});
		}
	}, [currentDirectory, dispatch, handleResponse, id]);

	return (
		<div className="h-full w-full bg-gray-950 text-sm font-bold text-white">
			{terminalRows.map((row, index) => (
				<Fragment key={index}>
					<div className="mb-1 flex items-center">
						<span className="font-bold text-green-500">techcoderio@term</span>
						<span className="font-bold text-white">:</span>
						<span className="font-bold text-blue-500">~</span>
						<span className="font-bold text-blue-500">{row.directory}</span>
						<span className="mr-1 font-bold text-white">$</span>
						<input
							type="text"
							className="w-full bg-gray-950 text-white outline-none"
							value={row.text}
							onChange={(e) => onChange(e, index)}
							onKeyDown={(e) => onKeyDown(e, index)}
							autoFocus={row.focused}
							disabled={row.disabled}
							spellCheck={false}
							autoComplete="off"
						/>
					</div>
					{row.response && <div className="mb-2 mt-2">{row.response}</div>}
				</Fragment>
			))}
		</div>
	);
};

export { Terminal };
