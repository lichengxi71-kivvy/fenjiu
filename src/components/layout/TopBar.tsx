import { QuarterKey } from '../../types';

interface TopBarProps {
  quarter: QuarterKey;
  meetingMode: boolean;
  meetingStep: number;
  onQuarterChange: (quarter: QuarterKey) => void;
  onToggleMeetingMode: () => void;
  onResetDemoData: () => void;
  onExportChecklist: () => void;
}

export function TopBar({
  quarter,
  meetingMode,
  meetingStep,
  onQuarterChange,
  onToggleMeetingMode,
  onResetDemoData,
  onExportChecklist
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-paper/90 px-8 py-4 backdrop-blur">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-qinghua/15 bg-ciwhite px-3 py-1 text-xs text-qinghua">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-mutedgold" />
            汾酒集团特色业务原型 · AI 快速生成
          </div>
          <h2 className="font-serif text-2xl font-semibold text-mlan">清香汾品牌活动与渠道协同平台</h2>
          <div className="mt-2 h-px w-80 bg-gradient-to-r from-mutedgold/70 via-qinghua/40 to-transparent" />
          <p className="mt-1 max-w-4xl text-sm text-slate-600">
            围绕汾酒、竹叶青、杏花村多品牌协同，支持品牌活动管理、渠道执行跟踪、文旅联动运营与异常督办闭环。
          </p>
          {meetingMode && (
            <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-dianqing/20 bg-dianqing/10 px-3 py-1 text-xs text-dianqing">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-dianqing" />
              晨会模式运行中：第 {meetingStep} / 5 站点
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={quarter}
            onChange={(event) => onQuarterChange(event.target.value as QuarterKey)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-dianqing/30"
          >
            <option value="2026Q2">2026 年 Q2</option>
            <option value="2026Q1">2026 年 Q1</option>
          </select>
          <button
            onClick={onToggleMeetingMode}
            className={`rounded-xl px-3 py-2 text-sm shadow-sm transition ${
              meetingMode
                ? 'border border-dianqing/30 bg-dianqing text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-dianqing/30'
            }`}
          >
            {meetingMode ? '停止晨会模式' : '总部晨会模式'}
          </button>
          <button
            onClick={onResetDemoData}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-dianqing/40"
          >
            演示数据重置
          </button>
          <button
            onClick={onExportChecklist}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-dianqing/40"
          >
            导出督办清单
          </button>
          <button className="relative rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-dianqing/40">
            消息提醒
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-sealred px-1 text-[10px] text-white">
              4
            </span>
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dianqing/15 text-xs font-semibold text-dianqing">
              HQ
            </div>
            <div className="text-sm">
              <p className="font-medium text-slate-800">总部演示账号</p>
              <p className="text-xs text-slate-500">数字化管理部</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
