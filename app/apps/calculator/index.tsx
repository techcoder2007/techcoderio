import { useState, useEffect } from "react";
import { Display } from "./display";
import { Keypad } from "./keypad";

type Operation = "+" | "-" | "×" | "÷" | "=" | null;

const Calculator = () => {
	const [display, setDisplay] = useState("0");
	const [firstNumber, setFirstNumber] = useState<number | null>(null);
	const [operation, setOperation] = useState<Operation>(null);
	const [newNumber, setNewNumber] = useState(true);

	const handleNumber = (num: string) => {
		if (newNumber || display === "0") {
			setDisplay(num);
			setNewNumber(false);
		} else {
			setDisplay(display + num);
		}
	};

	const handleDecimal = () => {
		if (newNumber) {
			setDisplay("0.");
			setNewNumber(false);
		} else if (!display.includes(".")) {
			setDisplay(display + ".");
		}
	};

	const calculate = (a: number, b: number, op: Operation): number => {
		switch (op) {
			case "+":
				return a + b;
			case "-":
				return a - b;
			case "×":
				return a * b;
			case "÷":
				return b !== 0 ? a / b : 0;
			default:
				return b;
		}
	};

	const handleOperation = (op: Operation) => {
		const currentNumber = parseFloat(display);
		if (firstNumber === null) {
			setFirstNumber(currentNumber);
			setOperation(op);
			setNewNumber(true);
		} else if (operation) {
			const result = calculate(firstNumber, currentNumber, operation);
			setDisplay(result.toString());
			setFirstNumber(op === "=" ? null : result);
			setOperation(op === "=" ? null : op);
			setNewNumber(true);
		}
	};

	const clear = () => {
		setDisplay("0");
		setFirstNumber(null);
		setOperation(null);
		setNewNumber(true);
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key >= "0" && event.key <= "9") {
			handleNumber(event.key);
		} else if (event.key === ".") {
			handleDecimal();
		} else if (event.key === "+") {
			handleOperation("+");
		} else if (event.key === "-") {
			handleOperation("-");
		} else if (event.key === "*") {
			handleOperation("×");
		} else if (event.key === "/") {
			handleOperation("÷");
		} else if (event.key === "Enter" || event.key === "=") {
			handleOperation("=");
		} else if (event.key === "Escape") {
			clear();
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [display, firstNumber, operation, newNumber]);

	return (
		<div className="flex h-full items-center justify-center bg-gray-950 p-4">
			<div className="w-full overflow-hidden rounded-lg">
				<Display value={display} />
				<Keypad
					onNumberClick={handleNumber}
					onOperationClick={handleOperation}
					onClear={clear}
				/>
			</div>
		</div>
	);
};

export { Calculator };
