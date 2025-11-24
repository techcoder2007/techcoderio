import { Delete, Equal, Minus, Plus, X } from "lucide-react";
import { Button } from "~/components/core/button";
import { OPERATIONS } from "~/constants/data";
import { OperationType } from "~/enums/calculator";

interface KeypadProps {
  onNumberClick: (num: string) => void;
  onOperationClick: (op: OperationType) => void;
  onClear: () => void;
}

const Keypad = ({
  onNumberClick,
  onOperationClick,
  onClear,
}: KeypadProps) => {
  const renderOperationIcon = (op: OperationType) => {
    switch (op) {
      case OperationType.MULTIPLY:
        return <X size={20} />;
      case OperationType.SUBTRACT:
        return <Minus size={20} />;
      case OperationType.ADD:
        return <Plus size={20} />;
      case OperationType.EQUALS:
        return <Equal size={20} />;
      case OperationType.BACKSPACE:
        return <Delete size={18} />;
      default:
        return OPERATIONS[op].symbol;
    }
  };

  const getOperationClassName = (op: OperationType) => {
    const baseClasses = "h-12 transition-colors font-medium";
    const category = OPERATIONS[op].category;

    switch (category) {
      case "control":
        if (op === OperationType.CLEAR) {
          return `${baseClasses} bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white`;
        }
        return `${baseClasses} bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 text-white`;
      
      case "scientific":
        return `${baseClasses} bg-blue-400 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 text-white`;
      
      case "basic":
      default:
        return `${baseClasses} bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white`;
    }
  };

  return (
    <div className="grid grid-cols-6 gap-2 p-4 bg-gray-800 rounded-lg">
      {/* Row 1 */}
      {[7, 8, 9].map((num) => (
        <Button
          key={num}
		  
          onClick={() => onNumberClick(num.toString())}
          size='xl'
		  className="border border-gray-600"
		  variant='outline'
        >
          {num}
        </Button>
      ))}
      <Button
        onClick={() => onOperationClick(OperationType.ADD)}
        className={getOperationClassName(OperationType.ADD)}
      >
        {renderOperationIcon(OperationType.ADD)}
      </Button>
      <Button
        onClick={() => onOperationClick(OperationType.BACKSPACE)}
        className={getOperationClassName(OperationType.BACKSPACE)}
      >
        {renderOperationIcon(OperationType.BACKSPACE)}
      </Button>
      <Button
        onClick={onClear}
        className={getOperationClassName(OperationType.CLEAR)}
      >
        {renderOperationIcon(OperationType.CLEAR)}
      </Button>

      {/* Row 2 */}
      {[4, 5, 6].map((num) => (
        <Button
          key={num}
          onClick={() => onNumberClick(num.toString())}
          size='xl'
		  className="border border-gray-600"
		  variant='outline'
        >
          {num}
        </Button>
      ))}
      <Button
        onClick={() => onOperationClick(OperationType.MULTIPLY)}
        className={getOperationClassName(OperationType.MULTIPLY)}
      >
        {renderOperationIcon(OperationType.MULTIPLY)}
      </Button>
      <Button
        onClick={() => onOperationClick(OperationType.PAREN_OPEN)}
        className={getOperationClassName(OperationType.PAREN_OPEN)}
      >
        {renderOperationIcon(OperationType.PAREN_OPEN)}
      </Button>
      <Button
        onClick={() => onOperationClick(OperationType.PAREN_CLOSE)}
        className={getOperationClassName(OperationType.PAREN_CLOSE)}
      >
        {renderOperationIcon(OperationType.PAREN_CLOSE)}
      </Button>

      {/* Row 3 */}
      {[1, 2, 3].map((num) => (
        <Button
          key={num}
          onClick={() => onNumberClick(num.toString())}
          size='xl'
		  className="border border-gray-600"
		  variant='outline'
        >
          {num}
        </Button>
      ))}
      <Button
        onClick={() => onOperationClick(OperationType.SUBTRACT)}
        className={getOperationClassName(OperationType.SUBTRACT)}
      >
        {renderOperationIcon(OperationType.SUBTRACT)}
      </Button>
      <Button
        onClick={() => onOperationClick(OperationType.SQUARE)}
        className={getOperationClassName(OperationType.SQUARE)}
      >
        {renderOperationIcon(OperationType.SQUARE)}
      </Button>
      <Button
        onClick={() => onOperationClick(OperationType.SQUARE_ROOT)}
        className={getOperationClassName(OperationType.SQUARE_ROOT)}
      >
        {renderOperationIcon(OperationType.SQUARE_ROOT)}
      </Button>

      {/* Row 4 */}
      <Button
        onClick={() => onNumberClick("0")}
        size='xl'
		className="border border-gray-600"
		variant='outline'
      >
        0
      </Button>
      <Button
        onClick={() => onOperationClick(OperationType.DECIMAL)}
        size='xl'
		className="border border-gray-600"
		variant='outline'
      >
        {OPERATIONS[OperationType.DECIMAL].symbol}
      </Button>
      <Button
        onClick={() => onOperationClick(OperationType.PERCENTAGE)}
        className={getOperationClassName(OperationType.PERCENTAGE)}
      >
        {renderOperationIcon(OperationType.PERCENTAGE)}
      </Button>
      <Button
        onClick={() => onOperationClick(OperationType.ADD)}
        className={getOperationClassName(OperationType.ADD)}
      >
        {renderOperationIcon(OperationType.ADD)}
      </Button>
      <Button
        onClick={() => onOperationClick(OperationType.EQUALS)}
        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white col-span-2 h-12 transition-colors font-medium"
      >
        {renderOperationIcon(OperationType.EQUALS)}
      </Button>
    </div>
  );
};

export { Keypad };
