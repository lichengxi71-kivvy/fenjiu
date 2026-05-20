import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Drawer } from '../components/ui/Drawer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { aiSuggestionText, supervisionItems, supervisionStatusData } from '../data/mockData';
import { SupervisionItem } from '../types';

const colors = ['#C5A46D', '#1E5A8A', '#5E8FB3', '#A63A3A'];

export function SupervisionPage() {
  const [selected, setSelected] = useState<SupervisionItem | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const overdueCount = useMemo(
    () => supervisionItems.filter((item) => item.status === '已逾期').length,
    []
  );

  const handleGenerateSuggestion = () => {
    setAiLoading(true);
    setAiSuggestion('');
    window.setTimeout(() => {
      setAiSuggestion(aiSuggestionText);
      setAiLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="font-serif text-xl text-mlan">异常督办中心</h3>
        <p className="mt-1 text-sm text-slate-600">
          对活动执行、渠道参与、预算使用、文旅推进等异常事项形成责任到人的闭环跟踪。
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card xl:col-span-8">
          <div className="border-b border-slate-100 px-4 py-3">
            <h4 className="font-serif text-lg text-mlan">督办事项表</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-mist/65 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">督办事项</th>
                  <th className="px-4 py-3 text-left font-medium">问题类型</th>
                  <th className="px-4 py-3 text-left font-medium">关联区域</th>
                  <th className="px-4 py-3 text-left font-medium">责任部门</th>
                  <th className="px-4 py-3 text-left font-medium">责任人</th>
                  <th className="px-4 py-3 text-left font-medium">截止日期</th>
                  <th className="px-4 py-3 text-left font-medium">优先级</th>
                  <th className="px-4 py-3 text-left font-medium">当前状态</th>
                  <th className="px-4 py-3 text-left font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {supervisionItems.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 transition hover:bg-mist/35">
                    <td className="px-4 py-3 font-medium text-slate-800">{item.task}</td>
                    <td className="px-4 py-3">{item.issueType}</td>
                    <td className="px-4 py-3">{item.region}</td>
                    <td className="px-4 py-3">{item.department}</td>
                    <td className="px-4 py-3">{item.owner}</td>
                    <td className="px-4 py-3">{item.deadline}</td>
                    <td className="px-4 py-3">
                      <StatusBadge value={item.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(item)}
                        className="rounded-lg border border-dianqing/25 px-2.5 py-1 text-xs text-dianqing transition hover:bg-dianqing/10"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5 xl:col-span-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h4 className="mb-2 font-serif text-lg text-mlan">督办状态分布</h4>
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={supervisionStatusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={82}>
                    {supervisionStatusData.map((entry, idx) => (
                      <Cell key={entry.name} fill={colors[idx % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value} 项`, name]}
                    contentStyle={{ borderRadius: 12, borderColor: '#D8E1E8', background: '#FBF9F4' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-slate-600">
              {supervisionStatusData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: colors[idx] }} />
                  <span>
                    {item.name}：{item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-dianqing/20 bg-gradient-to-br from-ciwhite to-mist/70 p-5 shadow-card">
            <h4 className="mb-2 font-serif text-lg text-mlan">AI 整改建议</h4>
            <p className="mb-3 text-sm text-slate-600">高优事项 {overdueCount} 项已逾期，建议优先生成可执行整改路径。</p>
            <button
              onClick={handleGenerateSuggestion}
              disabled={aiLoading}
              className="rounded-xl bg-dianqing px-4 py-2 text-sm font-medium text-white transition hover:bg-qinghua disabled:cursor-not-allowed disabled:bg-dianqing/70"
            >
              {aiLoading ? '建议生成中...' : '自动生成整改建议'}
            </button>
            {aiSuggestion && (
              <p className="mt-3 rounded-xl border border-slate-200 bg-white/90 p-3 text-sm leading-relaxed text-slate-700">
                {aiSuggestion}
              </p>
            )}
          </div>
        </div>
      </section>

      <Drawer open={Boolean(selected)} title="督办事项详情" onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-slate-500">问题摘要</p>
              <p className="mt-1 text-slate-800">{selected.summary}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">可能原因</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-slate-700">
                {selected.reasons.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-slate-500">建议措施</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-slate-700">
                {selected.actions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InfoCard label="负责人" value={selected.owner} />
              <InfoCard label="预计完成时间" value={selected.expectedDate} />
            </div>
            <div>
              <p className="text-xs text-slate-500">当前进展</p>
              <p className="mt-1 rounded-xl border border-slate-200 bg-white p-3 text-slate-700">{selected.progress}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-800">{value}</p>
    </div>
  );
}
