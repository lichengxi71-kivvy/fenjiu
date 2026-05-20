import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { fetchDealer } from '../api/client';
import { KpiCard } from '../components/ui/KpiCard';
import {
  dealerExecutionRows,
  dealerKpis,
  dealerParticipationTrend,
  lowParticipationWarnings
} from '../data/mockData';
import { QuarterKey } from '../types';

interface DealerCollabPageProps {
  quarter: QuarterKey;
  meetingMode: boolean;
}

export function DealerCollabPage({ quarter, meetingMode }: DealerCollabPageProps) {
  const [taskMessage, setTaskMessage] = useState('');
  const [apiConnected, setApiConnected] = useState(false);
  const [apiData, setApiData] = useState<{
    kpis: typeof dealerKpis;
    executionRows: typeof dealerExecutionRows;
    participationTrend: typeof dealerParticipationTrend;
    warnings: typeof lowParticipationWarnings;
  } | null>(null);

  useEffect(() => {
    if (meetingMode) {
      setTaskMessage('晨会模式：已自动识别低参与区域，建议优先督办华东与西北。');
    }
  }, [meetingMode]);

  useEffect(() => {
    let cancelled = false;
    fetchDealer(quarter)
      .then((data) => {
        if (!cancelled) {
          setApiData({
            kpis: data.kpis,
            executionRows: data.executionRows,
            participationTrend: data.participationTrend,
            warnings: data.warnings
          });
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
  }, [quarter]);

  const adjustedKpis = useMemo(() => {
    if (apiData) {
      return apiData.kpis;
    }
    if (quarter === '2026Q2') {
      return dealerKpis;
    }
    return dealerKpis.map((item) => {
      if (item.id === 'd1') return { ...item, value: '1,248', trend: '季度净增 21 家' };
      if (item.id === 'd2') return { ...item, value: '792', trend: '参与覆盖 63%' };
      if (item.id === 'd3') return { ...item, value: '69%', trend: '较上月 +1%' };
      if (item.id === 'd4') return { ...item, value: '4', trend: '较上月 +1' };
      return item;
    });
  }, [apiData, quarter]);

  const executionRows = useMemo(() => {
    if (apiData) {
      return apiData.executionRows;
    }
    if (quarter === '2026Q2') {
      return dealerExecutionRows;
    }
    return dealerExecutionRows.map((row) => ({
      ...row,
      executed: Math.max(60, row.executed - 12),
      materialRate: Math.max(55, row.materialRate - 5),
      feedbackRate: Math.max(48, row.feedbackRate - 6),
      score: Math.max(3.1, Number((row.score - 0.2).toFixed(1)))
    }));
  }, [apiData, quarter]);

  const participationTrend = useMemo(() => {
    if (apiData) {
      return apiData.participationTrend;
    }
    if (quarter === '2026Q2') {
      return dealerParticipationTrend;
    }
    return dealerParticipationTrend.map((row) => ({
      ...row,
      rate: Math.max(45, row.rate - 6)
    }));
  }, [apiData, quarter]);

  const warnings = useMemo(() => {
    if (apiData) {
      return apiData.warnings;
    }
    if (quarter === '2026Q2') {
      return lowParticipationWarnings;
    }
    return lowParticipationWarnings.map((row) => ({
      ...row,
      rate: Math.max(50, row.rate - 4)
    }));
  }, [apiData, quarter]);

  const handleSuggestTask = (region: string) => {
    setTaskMessage(`已为 ${region} 区域生成督办任务建议，可在异常督办中心继续跟踪。`);
    window.setTimeout(() => setTaskMessage(''), 2600);
  };

  const handleCreateBatchTasks = () => {
    setTaskMessage('已批量生成华东、西北、华南区域督办任务草案。');
    window.setTimeout(() => setTaskMessage(''), 2600);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-mlan">经销商协同</h3>
            <p className="mt-1 text-sm text-slate-600">
              实时关注区域经销商参与情况、活动执行能力与物料反馈效率。
            </p>
          </div>
          <button
            onClick={handleCreateBatchTasks}
            className="rounded-xl border border-dianqing/30 bg-dianqing/5 px-3 py-2 text-xs font-medium text-dianqing transition hover:bg-dianqing/10"
          >
            一键生成区域督办
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">当前周期：{quarter === '2026Q2' ? '2026 年 Q2' : '2026 年 Q1'}</p>
        <p className={`mt-1 text-xs ${apiConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
          {apiConnected ? '经销商数据来自后端接口' : '经销商数据当前使用前端兜底'}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {adjustedKpis.map((item) => (
          <KpiCard key={item.id} item={item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card xl:col-span-7">
          <div className="border-b border-slate-100 px-4 py-3">
            <h4 className="font-serif text-lg text-mlan">区域经销商执行表</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-mist/65 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">区域</th>
                  <th className="px-4 py-3 text-left font-medium">报名经销商数</th>
                  <th className="px-4 py-3 text-left font-medium">实际执行数</th>
                  <th className="px-4 py-3 text-left font-medium">物料领取率</th>
                  <th className="px-4 py-3 text-left font-medium">反馈完成率</th>
                  <th className="px-4 py-3 text-left font-medium">参与评分</th>
                </tr>
              </thead>
              <tbody>
                {executionRows.map((row) => (
                  <tr key={row.region} className="border-t border-slate-100 transition hover:bg-mist/35">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.region}</td>
                    <td className="px-4 py-3">{row.enrolled}</td>
                    <td className="px-4 py-3">{row.executed}</td>
                    <td className="px-4 py-3">{row.materialRate}%</td>
                    <td className="px-4 py-3">{row.feedbackRate}%</td>
                    <td className="px-4 py-3 text-qinghua">{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card xl:col-span-5">
          <h4 className="mb-3 font-serif text-lg text-mlan">区域参与率</h4>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={participationTrend} layout="vertical" margin={{ top: 8, right: 20, left: 10, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D6E1E8" />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                <YAxis type="category" dataKey="region" width={46} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, '参与率']}
                  contentStyle={{ borderRadius: 12, borderColor: '#D8E1E8', background: '#FBF9F4' }}
                />
                <Bar dataKey="rate" fill="#1E5A8A" radius={[0, 8, 8, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {warnings.map((item, index) => (
          <article
            key={item.region}
            className={`rounded-2xl border bg-white p-4 shadow-card ${
              meetingMode && index < 2 ? 'border-sealred/30 ring-1 ring-sealred/15' : 'border-slate-200'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium text-slate-800">{item.region}</h4>
              <span className="rounded-full bg-sealred/10 px-2.5 py-1 text-xs text-sealred">{item.rate}%</span>
            </div>
            <p className="mb-2 text-sm text-slate-700">{item.issue}</p>
            <p className="mb-3 text-xs text-slate-500">可能影响：{item.impact}</p>
            <button
              onClick={() => handleSuggestTask(item.region)}
              className="rounded-lg border border-dianqing/25 px-3 py-1.5 text-xs text-dianqing transition hover:bg-dianqing/10"
            >
              建议生成督办任务
            </button>
          </article>
        ))}
      </section>

      {taskMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {taskMessage}
        </div>
      )}

      <section className="rounded-2xl border border-dianqing/20 bg-gradient-to-r from-white to-mist/65 p-5 shadow-card">
        <p className="text-sm leading-relaxed text-slate-700">
          将区域经销商活动报名、执行、反馈纳入统一视图，有助于总部快速识别低活跃区域并进行专项督办。
        </p>
      </section>
    </div>
  );
}
