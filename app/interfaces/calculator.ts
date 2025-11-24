import type { OperationCategory, OperationType } from "~/enums/calculator";

export interface CalculatorState {
	display: string;
	firstNumber: number | null;
	operation: OperationType | null;
	newNumber: boolean;
	expression: string;
	lastResult: number | null;
}

export type CalculationResult = {
	result: number;
	success: boolean;
	error?: string;
};

export interface OperationMetadata {
	type: OperationType;
	category: OperationCategory;
	symbol: string;
	precedence: number;
	unary?: boolean;
	requiresSecondOperand?: boolean;
}
