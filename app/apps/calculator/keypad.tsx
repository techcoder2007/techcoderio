import { X, Minus, Plus, Equal, Delete } from "lucide-react";
import { Button } from "~/components/core/button";

interface KeypadProps {
	onNumberClick: (num: string) => void;
	onOperationClick: any;
	onClear: () => void;
}

const Keypad = ({
	onNumberClick,
	onOperationClick,
	onClear,
}: KeypadProps) => {
	return (
		<div className="grid grid-cols-6 gap-2 p-4 bg-gray-900 rounded-lg">
			{[7, 8, 9].map((num) => (
				<Button
					key={num}
					onClick={() => onNumberClick(num.toString())}
					size='xl'
					variant='outline'
				>
					{num}
				</Button>
			))}
			<Button
				onClick={() => onOperationClick("+")}
				size='xl'
				variant='outline'
				className="bg-blue-500 text-white hover:bg-blue-600 border-blue-600 text-lg font-medium h-12"
			>
				+
			</Button>
			<Button
				onClick={() => onOperationClick("backspace")}
				className="bg-gray-500 text-white hover:bg-gray-600 border-gray-600 h-12"
			>
				<Delete size={18} />
			</Button>
			<Button
				onClick={onClear}
				className="bg-red-500 text-white hover:bg-red-600 border-red-600 text-lg font-medium h-12"
			>
				C
			</Button>

			{/* Row 2 */}
			{[4, 5, 6].map((num) => (
				<Button
					key={num}
					onClick={() => onNumberClick(num.toString())}
					size='xl'
					variant='outline'
				>
					{num}
				</Button>
			))}
			<Button
				onClick={() => onOperationClick("×")}
				className="bg-blue-500 text-white hover:bg-blue-600 border-blue-600 h-12"
			>
				<X size={20} />
			</Button>
			<Button
				onClick={() => onOperationClick("(")}
				className="bg-gray-300 text-gray-700 hover:bg-gray-400 border-gray-400 text-lg font-medium h-12"
			>
				(
			</Button>
			<Button
				onClick={() => onOperationClick(")")}
				className="bg-gray-300 text-gray-700 hover:bg-gray-400 border-gray-400 text-lg font-medium h-12"
			>
				)
			</Button>

			{/* Row 3 */}
			{[1, 2, 3].map((num) => (
				<Button
					key={num}
					onClick={() => onNumberClick(num.toString())}
					size='xl'
					variant='outline'
				>
					{num}
				</Button>
			))}
			<Button
				onClick={() => onOperationClick("-")}
				className="bg-blue-500 text-white hover:bg-blue-600 border-blue-600 h-12"
			>
				<Minus size={20} />
			</Button>
			<Button
				onClick={() => onOperationClick("x²")}
				className="bg-gray-300 text-gray-700 hover:bg-gray-400 border-gray-400 text-sm font-medium h-12"
			>
				x²
			</Button>
			<Button
				onClick={() => onOperationClick("√")}
				className="bg-gray-300 text-gray-700 hover:bg-gray-400 border-gray-400 text-lg font-medium h-12"
			>
				√
			</Button>

			{/* Row 4 */}
			<Button
				onClick={() => onNumberClick("0")}
				size='xl'
				variant='outline'
			>
				0
			</Button>
			<Button
				onClick={() => onNumberClick(".")}
				size='xl'
				variant='outline'
			>
				.
			</Button>
			<Button
				onClick={() => onOperationClick("%")}
				className="bg-gray-300 text-gray-700 hover:bg-gray-400 border-gray-400 text-lg font-medium h-12"
			>
				%
			</Button>
			<Button
				onClick={() => onOperationClick("+")}
				className="bg-blue-500 text-white hover:bg-blue-600 border-blue-600 h-12"
			>
				<Plus size={20} />
			</Button>
			<Button
				onClick={() => onOperationClick("=")}
				className="bg-green-500 text-white hover:bg-green-600 border-green-600 col-span-2 h-12"
			>
				<Equal size={20} />
			</Button>
		</div>
	);
};

export { Keypad };