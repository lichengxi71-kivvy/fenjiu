import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
  brandStructure,
  overviewAlerts,
  overviewKpis,
  platformValues,
  regionalExecution
} from '../data/mockData';
import { fetchOverview } from '../api/client';
import { KpiCard } from '../components/ui/KpiCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { QuarterKey } from '../types';

const brandColors = ['#1F4E79', '#3D7AA8', '#79A8C7'];

interface OverviewPageProps {
  quarter: QuarterKey;
  meetingMode: boolean;
}

const quarterRatio: Record<QuarterKey, number> = {
  '2026Q2': 1,
  '2026Q1': 0.89
};

export function OverviewPage({ quarter, meetingMode }: OverviewPageProps) {
  const [selectedAlertId, setSelectedAlertId] = useState<string>(overviewAlerts[0].id);
  const [focusText, setFocusText] = useState('');
  const [apiKpis, setApiKpis] = useState<{
    activities: number;
    dealers: number;
    provinces: number;
    completionRate: number;
    pendingCount: number;
  } | null>(null);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    if (meetingMode) {
      setSelectedAlertId(overviewAlerts[0].id);
    }
  }, [meetingMode]);

  useEffect(() => {
    let cancelled = false;
    fetchOverview(quarter)
      .then((data) => {
        if (!cancelled) {
          setApiKpis(data.kpis);
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

  const selectedAlert = useMemo(
    () => overviewAlerts.find((item) => item.id === selectedAlertId) ?? overviewAlerts[0],
    [selectedAlertId]
  );

  const ratio = quarterRatio[quarter];
  const kpis = useMemo(() => {
    const toInt = (value: number) => Math.max(1, Math.round(value * ratio));
    const finishedRatio = apiKpis?.completionRate ?? (quarter === '2026Q2' ? 76 : 69);
    const pending = apiKpis?.pendingCount ?? (quarter === '2026Q2' ? 12 : 17);
    return overviewKpis.map((item) => {
      if (item.id === 'k1') return { ...item, value: String(apiKpis?.activities ?? toInt(128)) };
      if (item.id === 'k2') return { ...item, value: String(apiKpis?.dealers ?? toInt(864)) };
      if (item.id === 'k3') return { ...item, value: String(apiKpis?.provinces ?? toInt(28)) };
      if (item.id === 'k4') return { ...item, value: `${finishedRatio}%`, trend: quarter === '2026Q2' ? '环比 +4%' : '环比 +2%' };
      if (item.id === 'k5') return { ...item, value: String(pending), trend: quarter === '2026Q2' ? '环比 -2 项' : '环比 +3 项' };
      return item;
    });
  }, [apiKpis, quarter, ratio]);

  const chartData = brandStructure.map((item) => ({
    ...item,
    value: Math.round(item.value * ratio)
  }));

  const regionData = regionalExecution.map((item) => {
    if (quarter === '2026Q2') {
      return item;
    }
    return {
      ...item,
      completion: Math.max(45, item.completion - 7),
      budget: Math.max(45, item.budget - 5),
      participation: Math.max(42, item.participation - 8)
    };
  });

  const handleGenerateFocusList = () => {
    const focus = [
      `1. ${selectedAlert.title}`,
      '2. 跟踪华东/西北两地执行与反馈闭环，确保周度复盘',
      '3. 对预算超阈值活动启动分段审批与节点复核'
    ].join('\n');
    setFocusText(focus);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-dianqing/20 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">集团总览 · 当前周期 {quarter === '2026Q2' ? '2026 年 Q2' : '2026 年 Q1'}</p>
            <p className={`mt-1 text-xs ${apiConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
              {apiConnected ? '后端接口已连接' : '后端未连接，使用前端兜底数据'}
            </p>
          </div>
          <button
            onClick={handleGenerateFocusList}
            className="rounded-xl border border-dianqing/30 bg-dianqing/5 px-3 py-1.5 text-xs font-medium text-dianqing transition hover:bg-dianqing/10"
          >
            生成季度关注清单
          </button>
        </div>
        {focusText && <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-mist/50 p-3 text-xs text-slate-700">{focusText}</pre>}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {kpis.map((item) => (
          <KpiCard key={item.id} item={item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card xl:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg text-mlan">品牌活动结构图</h3>
            <span className="text-xs text-slate-500">季度活动分布</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95}>
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={brandColors[index % brandColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value} 场活动`, name]}
                  contentStyle={{ borderRadius: 12, borderColor: '#D8E1E8', background: '#FBF9F4' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {chartData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: brandColors[idx] }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-mist/70 p-3 text-sm text-slate-600">
            汾酒主品牌活动仍占核心，竹叶青与杏花村承担差异化场景运营与文化延展。
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card xl:col-span-5">
          <h3 className="mb-4 font-serif text-lg text-mlan">区域执行情况</h3>
          <div className="space-y-4">
            {regionData.map((item) => (
              <div key={item.region} className="rounded-xl border border-slate-100 bg-paper p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium text-slate-800">{item.region}</p>
                  <p className="text-xs text-slate-500">经销商参与率 {item.participation}%</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="mb-1 text-slate-500">活动完成率</p>
                    <ProgressBar value={item.completion} color="blue" />
                  </div>
                  <div>
                    <p className="mb-1 text-slate-500">预算使用率</p>
                    <ProgressBar value={item.budget} color="gold" />
                  </div>
                  <div>
                    <p className="mb-1 text-slate-500">参与率</p>
                    <ProgressBar value={item.participation} color="green" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 xl:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <h3 className="mb-3 font-serif text-lg text-mlan">总部重点关注事项</h3>
            <div className="space-y-3">
              {overviewAlerts.map((item) => {
                const selected = item.id === selectedAlertId;
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border bg-paper p-3 transition ${
                      selected || (meetingMode && item.id === overviewAlerts[0].id)
                        ? 'border-sealred/30 ring-1 ring-sealred/20'
                        : 'border-slate-100'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <StatusBadge value={item.priority as '高' | '中' | '低'} />
                      <span className="text-xs text-slate-500">{item.module}</span>
                    </div>
                    <p className="mb-2 text-sm text-slate-700">{item.title}</p>
                    <button
                      onClick={() => setSelectedAlertId(item.id)}
                      className="rounded-lg border border-dianqing/25 px-2.5 py-1 text-xs text-dianqing transition hover:bg-dianqing/10"
                    >
                      查看详情
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <h4 className="mb-2 font-medium text-mlan">异常详情</h4>
            <p className="text-sm text-slate-700">{selectedAlert.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">{selectedAlert.detail}</p>
          </div>

          <div className="rounded-2xl border border-dianqing/20 bg-gradient-to-br from-ciwhite to-mist/70 p-4 shadow-card">
            <h3 className="mb-3 font-serif text-lg text-mlan">平台价值</h3>
            <div className="space-y-2">
              {platformValues.map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-lg bg-white/70 p-2 text-sm text-slate-700">
                  <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-mutedgold" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
