import { OperationCategory, OperationType } from "~/enums/calculator";
import type { OperationMetadata } from "~/interfaces/calculator";

export const menuItems = [
	{ name: "Portfolio", href: "/" },
	{ name: "Contact", href: "/contact" },
	{ name: "Projects", href: "/projects" },
] as const;

// Calculator Operations
export const OPERATIONS: Record<OperationType, OperationMetadata> = {
	[OperationType.ADD]: {
		type: OperationType.ADD,
		category: OperationCategory.BASIC,
		symbol: "+",
		precedence: 1,
		requiresSecondOperand: true,
	},
	[OperationType.SUBTRACT]: {
		type: OperationType.SUBTRACT,
		category: OperationCategory.BASIC,
		symbol: "-",
		precedence: 1,
		requiresSecondOperand: true,
	},
	[OperationType.MULTIPLY]: {
		type: OperationType.MULTIPLY,
		category: OperationCategory.BASIC,
		symbol: "×",
		precedence: 2,
		requiresSecondOperand: true,
	},
	[OperationType.DIVIDE]: {
		type: OperationType.DIVIDE,
		category: OperationCategory.BASIC,
		symbol: "÷",
		precedence: 2,
		requiresSecondOperand: true,
	},
	[OperationType.EQUALS]: {
		type: OperationType.EQUALS,
		category: OperationCategory.CONTROL,
		symbol: "=",
		precedence: 0,
	},
	[OperationType.BACKSPACE]: {
		type: OperationType.BACKSPACE,
		category: OperationCategory.CONTROL,
		symbol: "⌫",
		precedence: 0,
	},
	[OperationType.SQUARE]: {
		type: OperationType.SQUARE,
		category: OperationCategory.SCIENTIFIC,
		symbol: "x²",
		precedence: 3,
		unary: true,
	},
	[OperationType.SQUARE_ROOT]: {
		type: OperationType.SQUARE_ROOT,
		category: OperationCategory.SCIENTIFIC,
		symbol: "√",
		precedence: 3,
		unary: true,
	},
	[OperationType.PERCENTAGE]: {
		type: OperationType.PERCENTAGE,
		category: OperationCategory.SCIENTIFIC,
		symbol: "%",
		precedence: 3,
		unary: true,
	},
	[OperationType.PAREN_OPEN]: {
		type: OperationType.PAREN_OPEN,
		category: OperationCategory.BASIC,
		symbol: "(",
		precedence: 0,
	},
	[OperationType.PAREN_CLOSE]: {
		type: OperationType.PAREN_CLOSE,
		category: OperationCategory.BASIC,
		symbol: ")",
		precedence: 0,
	},
	[OperationType.CLEAR]: {
		type: OperationType.CLEAR,
		category: OperationCategory.CONTROL,
		symbol: "C",
		precedence: 0,
	},
	[OperationType.DECIMAL]: {
		type: OperationType.DECIMAL,
		category: OperationCategory.BASIC,
		symbol: ".",
		precedence: 0,
	},
};
