import type { ChangeEvent, KeyboardEvent, ReactNode } from "react";

interface TerminalRowProps {
	row: {
		text: string;
		focused: boolean;
		disabled: boolean;
		directory: string;
	};
	index: number;
	response?: ReactNode;
	onChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
	onKeyDown: (e: KeyboardEvent<HTMLInputElement>, index: number) => void;
}

export const TerminalRow = ({
	row,
	index,
	response,
	onChange,
	onKeyDown,
}: TerminalRowProps) => (
	<>
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
				disabled={row.disabled}
				spellCheck={false}
				// biome-ignore lint/a11y/noAutofocus: <explanation > 
				autoFocus={row.focused}
				autoComplete="off"
			/>
		</div>
		{response && <div className="mb-2 mt-2">{response}</div>}
	</>
);
