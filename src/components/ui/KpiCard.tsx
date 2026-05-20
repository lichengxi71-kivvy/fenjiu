import { KPIItem } from '../../types';

interface KpiCardProps {
  item: KPIItem;
}

export function KpiCard({ item }: KpiCardProps) {
  const trendColor =
    item.trendType === 'up'
      ? 'text-emerald-600'
      : item.trendType === 'down'
        ? 'text-sealred'
        : 'text-slate-600';

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-dianqing/40 hover:shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-600">{item.title}</p>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-dianqing/10 text-xs font-semibold text-dianqing">
          {item.icon}
        </span>
      </div>
      <p className="font-serif text-3xl font-semibold text-mlan">{item.value}</p>
      <p className={`mt-2 text-xs ${trendColor}`}>{item.trend}</p>
    </div>
  );
}
