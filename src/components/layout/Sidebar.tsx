import { navItems } from '../../data/mockData';
import { ModuleKey } from '../../types';

interface SidebarProps {
  active: ModuleKey;
  onChange: (key: ModuleKey) => void;
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="relative w-64 shrink-0 border-r border-slate-700/50 bg-mlan px-4 py-6 text-slate-100">
      <div className="mb-8 px-3">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-300/80">Fenjiu Group</p>
        <h1 className="mt-2 font-serif text-lg font-semibold text-ciwhite">集团协同管理</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-dianqing/30 text-ciwhite shadow-[0_10px_30px_rgba(30,90,138,0.35)]'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-ciwhite'
              }`}
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors ${
                  isActive
                    ? 'border-cyan-200/40 bg-cyan-100/15 text-cyan-100'
                    : 'border-slate-500/50 bg-slate-700/35 text-slate-200 group-hover:border-slate-300/60'
                }`}
              >
                {item.icon}
              </span>
              <span className="font-medium tracking-wide">{item.label}</span>
              {isActive && (
                <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-mutedgold" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </nav>
      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/40 p-3 text-xs leading-relaxed text-slate-300">
        <p className="mb-1 text-mutedgold">演示定位</p>
        <p>汾酒集团特色业务原型 · AI 快速生成</p>
      </div>
    </aside>
  );
}
