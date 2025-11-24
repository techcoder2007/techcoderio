import { Fragment, type ReactNode } from "react";
import { Command, Directory } from "~/enums/terminal";
import { openAppByTitle } from "~/redux/features/all-apps-slice";
import type { AppDispatch } from "~/redux/store";

export interface CommandResponse {
	response: ReactNode;
	directory: string;
}

export class TerminalCommandHandler {
	private currentDirectory: string;
	private dispatch: AppDispatch;

	constructor(dispatch: AppDispatch, currentDirectory: string) {
		this.dispatch = dispatch;
		this.currentDirectory = currentDirectory;
	}

	setCurrentDirectory(directory: string) {
		this.currentDirectory = directory;
	}

	handleCommand(text: string): CommandResponse {
		const trimmedText = text.trim();
		const [command, ...args] = trimmedText.split(" ");
		const fullCommand = `${command} ${args.join(" ")}`.trim();

		if (trimmedText === "") {
			return { response: "", directory: this.currentDirectory };
		}

		const basicCommandResponse = this.handleBasicCommands(
			trimmedText,
			fullCommand,
		);
		if (basicCommandResponse) return basicCommandResponse;

		const argumentCommandResponse = this.handleArgumentCommands(
			command,
			args,
			fullCommand,
		);
		if (argumentCommandResponse) return argumentCommandResponse;

		const specialCommandResponse = this.handleSpecialCommands(
			command,
			args,
			trimmedText,
		);
		if (specialCommandResponse) return specialCommandResponse;

		return {
			response: `Command '${trimmedText}' not found, or not yet implemented.`,
			directory: this.currentDirectory,
		};
	}

	private handleBasicCommands(
		trimmedText: string,
		fullCommand: string,
	): CommandResponse | null {
		switch (trimmedText) {
			case Command.PWD:
				return {
					response: `/home/techcoderio${this.currentDirectory}`,
					directory: this.currentDirectory,
				};

			case Command.WHOAMI:
				return {
					response: "techcoderio",
					directory: this.currentDirectory,
				};

			case Command.CODE:
				this.dispatch(openAppByTitle("code"));
				return {
					response: "Opening Visual Studio Code...",
					directory: this.currentDirectory,
				};
		}

		switch (fullCommand) {
			case Command.LS:
				return this.handleLsCommand();

			case Command.LS_LONG:
				return this.handleLsLongCommand();
		}

		return null;
	}

	private handleArgumentCommands(
		command: string,
		args: string[],
		_fullCommand: string,
	): CommandResponse | null {
		switch (command) {
			case Command.CD:
				return this.handleCdCommand(args);

			case Command.ECHO:
				return {
					response: args.join(" "),
					directory: this.currentDirectory,
				};

			case "calc":
			case "math":
				return this.handleMathCommand(args);

			case "js":
				return this.handleJsCommand(args);
		}

		return null;
	}

	private handleSpecialCommands(
		_command: string,
		_args: string[],
		trimmedText: string,
	): CommandResponse | null {
		// Auto-detect mathematical expressions
		if (
			/^[\d+\-*/().\s\^%]+$/.test(trimmedText) &&
			/[\d]/.test(trimmedText) &&
			!/[a-zA-Z]/.test(trimmedText)
		) {
			return this.handleAutoMath(trimmedText);
		}

		return null;
	}

	private handleCdCommand(args: string[]): CommandResponse {
		if (args.length === 0) {
			return {
				response: "cd: missing operand",
				directory: this.currentDirectory,
			};
		}

		const newDirectory = this.handleDirectoryChange(args[0]);
		if (newDirectory === "" && args[0] !== ".." && args[0] !== "") {
			return {
				response: `cd: ${args[0]}: No such file or directory`,
				directory: this.currentDirectory,
			};
		}

		this.currentDirectory = newDirectory;
		return { response: "", directory: newDirectory };
	}

	private handleLsCommand(): CommandResponse {
		return {
			response: (
				<div className="whitespace-pre-wrap">
					{Object.values(Directory)
						.filter((dir) => dir !== "")
						.map((dir, index) => (
							<Fragment key={dir}>
								<span className="text-yellow-500">{dir}</span>
								{index < Object.values(Directory).length - 2 && " "}
							</Fragment>
						))}
				</div>
			),
			directory: this.currentDirectory,
		};
	}

	private handleLsLongCommand(): CommandResponse {
		return {
			response: (
				<div className="whitespace-pre-wrap">
					<span>total 0</span>
					<br />
					{Object.values(Directory)
						.filter((dir) => dir !== "")
						.map((dir) => (
							<Fragment key={dir}>
								<span className="text-green-500">drwxr-xr-x</span> 2 techcoderio
								techcoderio 4096 Jul 1 10:00{" "}
								<span className="text-yellow-500">{dir}</span>
								<br />
							</Fragment>
						))}
				</div>
			),
			directory: this.currentDirectory,
		};
	}

	private handleMathCommand(args: string[]): CommandResponse {
		try {
			const expression = args.join(" ").trim();
			if (!expression) {
				return {
					response: "Usage: calc <expression> or math <expression>",
					directory: this.currentDirectory,
				};
			}

			if (
				!/^[0-9+\-*/().\s\^%!πe]+$/.test(expression) &&
				!/^(sin|cos|tan|log|ln|sqrt|abs|max|min|pow)\(/.test(expression)
			) {
				return {
					response:
						"Error: Only basic mathematical operations and functions are allowed",
					directory: this.currentDirectory,
				};
			}

			const processedExpression = expression
				.replace(/π/g, "Math.PI")
				.replace(/e/g, "Math.E")
				.replace(/sin\(/g, "Math.sin(")
				.replace(/cos\(/g, "Math.cos(")
				.replace(/tan\(/g, "Math.tan(")
				.replace(/log\(/g, "Math.log10(")
				.replace(/ln\(/g, "Math.log(")
				.replace(/sqrt\(/g, "Math.sqrt(")
				.replace(/abs\(/g, "Math.abs(")
				.replace(/\^/g, "**");

			const result = eval(processedExpression);
			return {
				response: (
					<div>
						<div>
							{expression} = {result}
						</div>
						<div className="text-gray-400 text-xs mt-1">Result: {result}</div>
					</div>
				),
				directory: this.currentDirectory,
			};
		} catch (error) {
			return {
				response: `Error: Invalid mathematical expression - ${(error as Error).message}`,
				directory: this.currentDirectory,
			};
		}
	}

	private handleJsCommand(args: string[]): CommandResponse {
		try {
			const jsCode = args.join(" ").trim();
			if (!jsCode) {
				return {
					response: "Usage: js <javascript_expression>",
					directory: this.currentDirectory,
				};
			}

			const dangerousPatterns = [
				"fetch",
				"XMLHttpRequest",
				"document",
				"window",
				"localStorage",
				"sessionStorage",
				"eval",
				"Function",
				"setTimeout",
				"setInterval",
				"setImmediate",
				"process",
				"require",
				"import",
				"module",
				"exports",
				"alert",
				"confirm",
				"prompt",
				"open",
				"close",
				"postMessage",
			];

			if (
				dangerousPatterns.some((pattern) => new RegExp(pattern, "i").test(jsCode))
			) {
				return {
					response:
						"Error: This JavaScript operation is not allowed for security reasons",
					directory: this.currentDirectory,
				};
			}

			const result = new Function(`return (${jsCode})`)();

			let displayResult: string | null = null;
			if (typeof result === "object" && result !== null) {
				displayResult = JSON.stringify(result, null, 2);
			} else if (typeof result === "function") {
				displayResult = result.toString();
			} else {
				displayResult = String(result);
			}

			return {
				response: (
					<div>
						<div className="text-green-500">{displayResult}</div>
						<div className="text-gray-400 text-xs mt-1">Type: {typeof result}</div>
					</div>
				),
				directory: this.currentDirectory,
			};
		} catch (error) {
			return {
				response: `Error: ${(error as Error).message}`,
				directory: this.currentDirectory,
			};
		}
	}

	private handleAutoMath(expression: string): CommandResponse {
		try {
			const result = eval(expression.replace(/\^/g, "**"));
			return {
				response: (
					<div>
						<div className="text-green-500">
							{expression} = {result}
						</div>
						<div className="text-gray-400 text-xs mt-1">
							Tip: Use "calc" command for more advanced math operations
						</div>
					</div>
				),
				directory: this.currentDirectory,
			};
		} catch (error) {
			return {
				response: `Error: ${(error as Error).message}`,
				directory: this.currentDirectory,
			};
		}
	}

	private handleDirectoryChange(directory: string): string {
		const directories = Object.values(Directory);

		if (directory === "" || directory === "..") {
			return "";
		} else if (directories.includes(directory as Directory)) {
			return `/${directory}`;
		}
		return "";
	}
}
