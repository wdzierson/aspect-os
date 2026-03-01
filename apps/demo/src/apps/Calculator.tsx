import { useState, useCallback } from 'react';

type Op = '+' | '-' | '×' | '÷' | null;

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<Op>(null);
  const [fresh, setFresh] = useState(true);

  const inputDigit = useCallback(
    (d: string) => {
      setDisplay((cur) => (fresh ? d : cur === '0' && d !== '.' ? d : cur + d));
      setFresh(false);
    },
    [fresh],
  );

  const selectOp = useCallback(
    (nextOp: Op) => {
      const current = parseFloat(display);
      if (prev !== null && op && !fresh) {
        const result = calc(prev, current, op);
        setDisplay(fmt(result));
        setPrev(result);
      } else {
        setPrev(current);
      }
      setOp(nextOp);
      setFresh(true);
    },
    [display, prev, op, fresh],
  );

  const evaluate = useCallback(() => {
    if (prev === null || !op) return;
    const current = parseFloat(display);
    const result = calc(prev, current, op);
    setDisplay(fmt(result));
    setPrev(null);
    setOp(null);
    setFresh(true);
  }, [display, prev, op]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setFresh(true);
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay((cur) => fmt(parseFloat(cur) * -1));
  }, []);

  const percent = useCallback(() => {
    setDisplay((cur) => fmt(parseFloat(cur) / 100));
  }, []);

  const btn = (label: string, onClick: () => void, style: string, span = 1) => (
    <button
      onClick={onClick}
      className={`${style} rounded-lg text-lg font-medium transition-all active:scale-95 active:brightness-90 ${
        span === 2 ? 'col-span-2' : ''
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-background select-none">
      <div className="flex-none px-5 pt-3 pb-2 text-right">
        <div className="text-[42px] font-extralight leading-tight text-foreground tracking-tight truncate">
          {display}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-[1px] p-[1px]">
        {btn('C', clear, 'bg-muted text-foreground hover:bg-muted/70')}
        {btn('±', toggleSign, 'bg-muted text-foreground hover:bg-muted/70')}
        {btn('%', percent, 'bg-muted text-foreground hover:bg-muted/70')}
        {btn('÷', () => selectOp('÷'), opStyle('÷'))}

        {btn('7', () => inputDigit('7'), numStyle)}
        {btn('8', () => inputDigit('8'), numStyle)}
        {btn('9', () => inputDigit('9'), numStyle)}
        {btn('×', () => selectOp('×'), opStyle('×'))}

        {btn('4', () => inputDigit('4'), numStyle)}
        {btn('5', () => inputDigit('5'), numStyle)}
        {btn('6', () => inputDigit('6'), numStyle)}
        {btn('-', () => selectOp('-'), opStyle('-'))}

        {btn('1', () => inputDigit('1'), numStyle)}
        {btn('2', () => inputDigit('2'), numStyle)}
        {btn('3', () => inputDigit('3'), numStyle)}
        {btn('+', () => selectOp('+'), opStyle('+'))}

        {btn('0', () => inputDigit('0'), numStyle, 2)}
        {btn('.', () => inputDigit('.'), numStyle)}
        {btn('=', evaluate, 'bg-accent text-accent-foreground hover:brightness-110')}
      </div>
    </div>
  );

  function opStyle(o: Op) {
    const active = op === o && fresh;
    return active
      ? 'bg-accent-foreground text-accent'
      : 'bg-accent text-accent-foreground hover:brightness-110';
  }
}

const numStyle = 'bg-secondary text-secondary-foreground hover:bg-secondary/70';

function calc(a: number, b: number, op: Op): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷': return b !== 0 ? a / b : 0;
    default: return b;
  }
}

function fmt(n: number): string {
  if (!isFinite(n)) return 'Error';
  const s = String(n);
  return s.length > 12 ? n.toPrecision(8) : s;
}
