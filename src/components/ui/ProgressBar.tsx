interface ProgressBarProps {
  value: number;
  color?: 'blue' | 'green' | 'red' | 'gold';
}

const colorMap = {
  blue: 'bg-dianqing',
  green: 'bg-emerald-500',
  red: 'bg-sealred',
  gold: 'bg-mutedgold'
};

export function ProgressBar({ value, color = 'blue' }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="h-2.5 overflow-hidden rounded-full bg-mist">
        <div
          className={`h-full rounded-full ${colorMap[color]} transition-all duration-500`}
          style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-600">{value}%</p>
    </div>
  );
}
