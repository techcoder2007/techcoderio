import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OPERATIONS } from "~/constants/data";
import { OperationType } from "~/enums/calculator";
import type { CalculationResult, CalculatorState } from "~/interfaces/calculator";
import { Display } from "./display";
import { Keypad } from "./keypad";

const INITIAL_STATE: CalculatorState = {
  display: "0",
  firstNumber: null,
  operation: null,
  newNumber: true,
  expression: "",
  lastResult: null,
};

const Calculator = () => {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const stateRef = useRef<CalculatorState>(state);
  stateRef.current = state;

  // Memoized calculation engine
  const calculate = useCallback((a: number, b: number, op: OperationType): CalculationResult => {
    try {
      let result: number;

      switch (op) {
        case OperationType.ADD:
          result = a + b;
          break;
        case OperationType.SUBTRACT:
          result = a - b;
          break;
        case OperationType.MULTIPLY:
          result = a * b;
          break;
        case OperationType.DIVIDE:
          if (b === 0) {
            return { result: 0, success: false, error: "Division by zero" };
          }
          result = a / b;
          break;
        default:
          return { result: b, success: false, error: "Unknown operation" };
      }

      // Handle floating point precision
      result = parseFloat(result.toPrecision(12));
      return { result, success: true };
    } catch (error) {
      return { result: 0, success: false, error: "Calculation error" };
    }
  }, []);

  const handleUnaryOperation = useCallback((op: OperationType, value: number): CalculationResult => {
    try {
      let result: number;

      switch (op) {
        case OperationType.SQUARE:
          result = value * value;
          break;
        case OperationType.SQUARE_ROOT:
          if (value < 0) {
            return { result: 0, success: false, error: "Invalid input" };
          }
          result = Math.sqrt(value);
          break;
        case OperationType.PERCENTAGE:
          result = value / 100;
          break;
        default:
          return { result: value, success: false, error: "Unknown unary operation" };
      }

      result = parseFloat(result.toPrecision(12));
      return { result, success: true };
    } catch (error) {
      return { result: value, success: false, error: "Unary operation error" };
    }
  }, []);

  const handleNumber = useCallback((num: string) => {
    setState(prev => {
      if (prev.newNumber || prev.display === "0") {
        return { 
          ...prev, 
          display: num, 
          newNumber: false,
          expression: prev.expression + (prev.newNumber ? " " + num : num)
        };
      } else {
        return { 
          ...prev, 
          display: prev.display + num,
          expression: prev.expression + num
        };
      }
    });
  }, []);

  const handleDecimal = useCallback(() => {
    setState(prev => {
      if (prev.newNumber) {
        return { 
          ...prev, 
          display: "0.", 
          newNumber: false,
          expression: prev.expression ? prev.expression + " 0." : "0."
        };
      } else if (!prev.display.includes(".")) {
        return { 
          ...prev, 
          display: prev.display + ".",
          expression: prev.expression + "."
        };
      }
      return prev;
    });
  }, []);

  const handleSpecialOperation = useCallback((op: OperationType) => {
    setState(prev => {
      const currentNumber = parseFloat(prev.display);
      let newDisplay = prev.display;
      let newExpression = prev.expression;

      switch (op) {
        case OperationType.BACKSPACE:
          if (prev.display.length > 1 && !prev.newNumber) {
            newDisplay = prev.display.slice(0, -1);
            newExpression = prev.expression.slice(0, -1);
          } else {
            newDisplay = "0";
            newExpression = "";
            return { ...prev, display: newDisplay, newNumber: true, expression: newExpression };
          }
          break;

        case OperationType.SQUARE:
        case OperationType.SQUARE_ROOT:
        case OperationType.PERCENTAGE: {
          const unaryResult = handleUnaryOperation(op, currentNumber);
          if (unaryResult.success) {
            newDisplay = unaryResult.result.toString();
            newExpression = `(${prev.display})${OPERATIONS[op].symbol}`;
          }
          break;
        }

        case OperationType.PAREN_OPEN:
        case OperationType.PAREN_CLOSE:
          newDisplay = prev.newNumber ? OPERATIONS[op].symbol : prev.display + OPERATIONS[op].symbol;
          newExpression = prev.expression + OPERATIONS[op].symbol;
          return { ...prev, display: newDisplay, newNumber: false, expression: newExpression };

        default:
          return prev;
      }

      return { ...prev, display: newDisplay, newNumber: true, expression: newExpression };
    });
  }, [handleUnaryOperation]);

  const handleOperation = useCallback((op: OperationType) => {
    // Handle clear operation
    if (op === OperationType.CLEAR) {
      setState(INITIAL_STATE);
      return;
    }

    // Handle special operations
    if ([
      OperationType.BACKSPACE,
      OperationType.SQUARE,
      OperationType.SQUARE_ROOT,
      OperationType.PERCENTAGE,
      OperationType.PAREN_OPEN,
      OperationType.PAREN_CLOSE
    ].includes(op)) {
      handleSpecialOperation(op);
      return;
    }

    // Handle decimal point
    if (op === OperationType.DECIMAL) {
      handleDecimal();
      return;
    }

    setState(prev => {
      const currentNumber = parseFloat(prev.display);
      const currentOp = OPERATIONS[op];
      
      if (prev.firstNumber === null) {
        return {
          ...prev,
          firstNumber: currentNumber,
          operation: op,
          newNumber: true,
          expression: `${prev.expression} ${currentOp.symbol} `,
        };
      } else if (prev.operation && op !== OperationType.EQUALS) {
        const calculation = calculate(prev.firstNumber, currentNumber, prev.operation);
        if (calculation.success) {
          return {
            display: calculation.result.toString(),
            firstNumber: calculation.result,
            operation: op,
            newNumber: true,
            expression: `${calculation.result.toString()} ${currentOp.symbol} `,
            lastResult: calculation.result,
          };
        }
      } else if (prev.operation && op === OperationType.EQUALS) {
        const calculation = calculate(prev.firstNumber, currentNumber, prev.operation);
        if (calculation.success) {
          return {
            display: calculation.result.toString(),
            firstNumber: null,
            operation: null,
            newNumber: true,
            expression: calculation.result.toString(),
            lastResult: calculation.result,
          };
        }
      }

      return prev;
    });
  }, [calculate, handleSpecialOperation, handleDecimal]);

  // Memoized keyboard handler
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const keyMap: Record<string, OperationType | string> = {
      "+": OperationType.ADD,
      "-": OperationType.SUBTRACT,
      "*": OperationType.MULTIPLY,
      "/": OperationType.DIVIDE,
      "Enter": OperationType.EQUALS,
      "=": OperationType.EQUALS,
      "Escape": OperationType.CLEAR,
      "c": OperationType.CLEAR,
      "C": OperationType.CLEAR,
      "Backspace": OperationType.BACKSPACE,
      "%": OperationType.PERCENTAGE,
      "(": OperationType.PAREN_OPEN,
      ")": OperationType.PAREN_CLOSE,
    };

    if (event.key >= "0" && event.key <= "9") {
      handleNumber(event.key);
    } else if (event.key === ".") {
      handleDecimal();
    } else if (keyMap[event.key]) {
      event.preventDefault();
      handleOperation(keyMap[event.key] as OperationType);
    }
  }, [handleNumber, handleDecimal, handleOperation]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const displayValue = useMemo(() => state.display, [state.display]);

  return (
    <div className="flex h-full items-center justify-center bg-gray-950 p-4">
      <div className="w-full overflow-hidden rounded-lg shadow-2xl">
        <Display value={displayValue} expression={state.expression} />
        <Keypad
          onNumberClick={handleNumber}
          onOperationClick={handleOperation}
          onClear={() => handleOperation(OperationType.CLEAR)}
        />
      </div>
    </div>
  );
};

export { Calculator };
