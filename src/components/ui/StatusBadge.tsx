import { ActivityStatus, PriorityLevel, SupervisionStatus } from '../../types';

interface StatusBadgeProps {
  value: ActivityStatus | SupervisionStatus | PriorityLevel;
}

const classMap: Record<string, string> = {
  未开始: 'bg-slate-100 text-slate-700 border-slate-200',
  进行中: 'bg-dianqing/10 text-dianqing border-dianqing/20',
  已完成: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  风险预警: 'bg-sealred/10 text-sealred border-sealred/20',
  待处理: 'bg-amber-50 text-amber-700 border-amber-200',
  处理中: 'bg-dianqing/10 text-dianqing border-dianqing/20',
  已逾期: 'bg-sealred/10 text-sealred border-sealred/20',
  高: 'bg-sealred/10 text-sealred border-sealred/20',
  中: 'bg-amber-50 text-amber-700 border-amber-200',
  低: 'bg-slate-100 text-slate-700 border-slate-200'
};

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${classMap[value]}`}>
      {value}
    </span>
  );
}
