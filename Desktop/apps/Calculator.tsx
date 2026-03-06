import { useState } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result = 0;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '*':
          result = currentValue * inputValue;
          break;
        case '/':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = previousValue + inputValue;
        break;
      case '-':
        result = previousValue - inputValue;
        break;
      case '*':
        result = previousValue * inputValue;
        break;
      case '/':
        result = inputValue !== 0 ? previousValue / inputValue : 0;
        break;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const Button = ({
    children,
    onClick,
    className = '',
    wide = false
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    wide?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`${wide ? 'col-span-2' : ''} h-14 rounded-full text-2xl font-light transition-all active:scale-95 active:brightness-75 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-black p-4">
      {/* Display */}
      <div className="flex-1 flex items-end justify-end px-4 pb-2">
        <span className="text-white text-6xl font-light truncate">
          {display.length > 9 ? parseFloat(display).toExponential(4) : display}
        </span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-3">
        <Button onClick={clear} className="bg-gray-400 text-black hover:bg-gray-300">
          {previousValue ? 'C' : 'AC'}
        </Button>
        <Button onClick={toggleSign} className="bg-gray-400 text-black hover:bg-gray-300">
          +/-
        </Button>
        <Button onClick={inputPercent} className="bg-gray-400 text-black hover:bg-gray-300">
          %
        </Button>
        <Button onClick={() => performOperation('/')} className={`${operation === '/' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white hover:bg-orange-400'}`}>
          ÷
        </Button>

        <Button onClick={() => inputDigit('7')} className="bg-gray-700 text-white hover:bg-gray-600">7</Button>
        <Button onClick={() => inputDigit('8')} className="bg-gray-700 text-white hover:bg-gray-600">8</Button>
        <Button onClick={() => inputDigit('9')} className="bg-gray-700 text-white hover:bg-gray-600">9</Button>
        <Button onClick={() => performOperation('*')} className={`${operation === '*' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white hover:bg-orange-400'}`}>
          ×
        </Button>

        <Button onClick={() => inputDigit('4')} className="bg-gray-700 text-white hover:bg-gray-600">4</Button>
        <Button onClick={() => inputDigit('5')} className="bg-gray-700 text-white hover:bg-gray-600">5</Button>
        <Button onClick={() => inputDigit('6')} className="bg-gray-700 text-white hover:bg-gray-600">6</Button>
        <Button onClick={() => performOperation('-')} className={`${operation === '-' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white hover:bg-orange-400'}`}>
          −
        </Button>

        <Button onClick={() => inputDigit('1')} className="bg-gray-700 text-white hover:bg-gray-600">1</Button>
        <Button onClick={() => inputDigit('2')} className="bg-gray-700 text-white hover:bg-gray-600">2</Button>
        <Button onClick={() => inputDigit('3')} className="bg-gray-700 text-white hover:bg-gray-600">3</Button>
        <Button onClick={() => performOperation('+')} className={`${operation === '+' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white hover:bg-orange-400'}`}>
          +
        </Button>

        <Button onClick={() => inputDigit('0')} wide className="bg-gray-700 text-white hover:bg-gray-600 text-left pl-7">
          0
        </Button>
        <Button onClick={inputDecimal} className="bg-gray-700 text-white hover:bg-gray-600">.</Button>
        <Button onClick={calculate} className="bg-orange-500 text-white hover:bg-orange-400">=</Button>
      </div>
    </div>
  );
};

export default Calculator;
