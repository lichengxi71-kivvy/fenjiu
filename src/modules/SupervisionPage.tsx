import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchAiSuggestion, fetchSupervisions, patchSupervisionStatus } from '../api/client';
import { Drawer } from '../components/ui/Drawer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { aiSuggestionText, supervisionItems, supervisionStatusData } from '../data/mockData';
import { QuarterKey, SupervisionItem } from '../types';

const colors = ['#C5A46D', '#1E5A8A', '#5E8FB3', '#A63A3A'];

interface SupervisionPageProps {
  quarter: QuarterKey;
  meetingMode: boolean;
}

export function SupervisionPage({ quarter, meetingMode }: SupervisionPageProps) {
  const [selected, setSelected] = useState<SupervisionItem | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [baseRows, setBaseRows] = useState<SupervisionItem[]>(supervisionItems);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    if (meetingMode) {
      setSelected(baseRows[0] ?? supervisionItems[0]);
    }
  }, [baseRows, meetingMode]);

  useEffect(() => {
    let cancelled = false;
    fetchSupervisions()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setBaseRows(data);
          setApiConnected(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApiConnected(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    if (quarter === '2026Q2') {
      return baseRows;
    }
    return baseRows.map((item) => {
      if (item.id === 's1') return { ...item, status: '待处理' as const };
      return item;
    });
  }, [baseRows, quarter]);

  const statusData = useMemo(() => {
    if (quarter === '2026Q2') {
      return supervisionStatusData;
    }
    return [
      { name: '待处理', value: 7 },
      { name: '处理中', value: 5 },
      { name: '已完成', value: 8 },
      { name: '已逾期', value: 3 }
    ];
  }, [quarter]);

  const overdueCount = useMemo(
    () => rows.filter((item) => item.status === '已逾期').length,
    [rows]
  );

  const handleGenerateSuggestion = () => {
    setAiLoading(true);
    setAiSuggestion('');
    const issue = selected?.task;
    fetchAiSuggestion(issue)
      .then((data) => {
        setAiSuggestion(data.content);
        setApiConnected(true);
      })
      .catch(() => {
        setAiSuggestion(aiSuggestionText);
        setApiConnected(false);
      })
      .finally(() => setAiLoading(false));
  };

  const handleMarkProcessing = (item: SupervisionItem) => {
    patchSupervisionStatus(item.id, '处理中')
      .then((updated) => {
        setBaseRows((prev) => prev.map((row) => (row.id === updated.id ? updated : row)));
        setApiConnected(true);
      })
      .catch(() => {
        setBaseRows((prev) =>
          prev.map((row) => (row.id === item.id ? { ...row, status: '处理中' as const } : row))
        );
        setApiConnected(false);
      });
  };

  const handleExportModuleChecklist = () => {
    const content = rows
      .map((item, index) => `${index + 1}. ${item.task} | ${item.region} | ${item.owner} | ${item.status}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `督办中心清单-${quarter}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-mlan">异常督办中心</h3>
            <p className="mt-1 text-sm text-slate-600">
              对活动执行、渠道参与、预算使用、文旅推进等异常事项形成责任到人的闭环跟踪。
            </p>
          </div>
          <button
            onClick={handleExportModuleChecklist}
            className="rounded-xl border border-dianqing/30 bg-dianqing/5 px-3 py-2 text-xs font-medium text-dianqing transition hover:bg-dianqing/10"
          >
            导出本次督办清单
          </button>
        </div>
        <p className={`mt-2 text-xs ${apiConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
          {apiConnected ? '督办数据来自后端接口' : '督办数据当前使用前端兜底'}
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
                {rows.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-t border-slate-100 transition hover:bg-mist/35 ${
                      meetingMode && index === 0 ? 'bg-sealred/5' : ''
                    }`}
                  >
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(item)}
                          className="rounded-lg border border-dianqing/25 px-2.5 py-1 text-xs text-dianqing transition hover:bg-dianqing/10"
                        >
                          查看详情
                        </button>
                        {item.status !== '处理中' && (
                          <button
                            onClick={() => handleMarkProcessing(item)}
                            className="rounded-lg border border-emerald-300 px-2.5 py-1 text-xs text-emerald-700 transition hover:bg-emerald-50"
                          >
                            转处理中
                          </button>
                        )}
                      </div>
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
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={82}>
                    {statusData.map((entry, idx) => (
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
              {statusData.map((item, idx) => (
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
