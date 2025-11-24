import {
	Fragment,
	useCallback,
	useState,
	type ChangeEvent,
	type KeyboardEvent,
	type ReactNode,
} from "react";
import { Command } from "~/enums/terminal";
import { closeApp } from "~/redux/features/all-apps-slice";
import { useAppDispatch } from "~/redux/hooks";
import { HelpCommand } from "./help-command";
import {
	TerminalCommandHandler,
	type CommandResponse,
} from "./terminal-command-handler";
import { TerminalRow } from "./terminal-row";

interface TerminalProps {
	id?: string;
}

interface ITerminalRow {
	text: string;
	focused: boolean;
	disabled: boolean;
	response?: ReactNode;
	directory: string;
}

const Terminal = ({ id }: TerminalProps) => {
	const dispatch = useAppDispatch();
	const [currentDirectory, setCurrentDirectory] = useState<string>("");
	const [terminalRows, setTerminalRows] = useState<ITerminalRow[]>([
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

	const commandHandler = new TerminalCommandHandler(dispatch, currentDirectory);

	const handleResponse = useCallback(
		(text: string): CommandResponse => {
			const response = commandHandler.handleCommand(text);
			setCurrentDirectory(response.directory);
			return response;
		},
		[commandHandler],
	);

	const onChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>, index: number) => {
			setTerminalRows((prev) =>
				prev.map((row, i) =>
					i === index ? { ...row, text: e.target.value } : row,
				),
			);
		},
		[],
	);

	const onKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>, index: number) => {
			if (e.key === "Enter") {
				setTerminalRows((prev) => {
					const newRows = prev.map((row, i) =>
						i === index ? { ...row, disabled: true, focused: false } : row,
					);

					const text = prev[index].text.trim();

					if (text === Command.CLEAR) {
						return [
							{
								text: "",
								focused: true,
								disabled: false,
								directory: currentDirectory,
								response: (
									<div className="text-gray-400 italic">
										Enter "help" command to know what commands are available in this
										terminal
									</div>
								),
							},
						];
					} else if (text === Command.EXIT) {
						dispatch(closeApp(id as string));
						return newRows;
					} else if (text === Command.HELP) {
						const updatedRows = newRows.map((row, i) =>
							i === index ? { ...row, response: <HelpCommand /> } : row,
						);

						updatedRows.push({
							text: "",
							focused: true,
							disabled: false,
							directory: currentDirectory,
						});

						return updatedRows;
					} else {
						const response = handleResponse(text);
						const updatedRows = newRows.map((row, i) =>
							i === index ? { ...row, response: response.response } : row,
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
		},
		[currentDirectory, dispatch, handleResponse, id],
	);

	return (
		<div className="h-full w-full bg-gray-950 text-sm font-bold text-white overflow-auto">
			{terminalRows.map((row, index) => (
				<Fragment key={index}>
					<TerminalRow
						row={row}
						index={index}
						response={row.response}
						onChange={onChange}
						onKeyDown={onKeyDown}
					/>
				</Fragment>
			))}
		</div>
	);
};

export { Terminal };
