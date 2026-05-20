export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-paper/90 px-8 py-4 backdrop-blur">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-qinghua/15 bg-ciwhite px-3 py-1 text-xs text-qinghua">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-mutedgold" />
            汾酒集团特色业务原型 · AI 快速生成
          </div>
          <h2 className="font-serif text-2xl font-semibold text-mlan">清香汾品牌活动与渠道协同平台</h2>
          <p className="mt-1 max-w-4xl text-sm text-slate-600">
            围绕汾酒、竹叶青、杏花村多品牌协同，支持品牌活动管理、渠道执行跟踪、文旅联动运营与异常督办闭环。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-dianqing/30">
            <option>2026 年 Q2</option>
            <option>2026 年 Q1</option>
            <option>2025 年 Q4</option>
          </select>
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
