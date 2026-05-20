import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchTourism } from '../api/client';
import { KpiCard } from '../components/ui/KpiCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { tourismKpis, tourismProjects, tourismTrend, tourismValues } from '../data/mockData';
import { QuarterKey } from '../types';

interface CulturalTourismPageProps {
  quarter: QuarterKey;
  meetingMode: boolean;
}

export function CulturalTourismPage({ quarter, meetingMode }: CulturalTourismPageProps) {
  const [planText, setPlanText] = useState('');
  const [apiConnected, setApiConnected] = useState(false);
  const [apiData, setApiData] = useState<{
    kpis: typeof tourismKpis;
    projects: typeof tourismProjects;
    trend: typeof tourismTrend;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTourism(quarter)
      .then((data) => {
        if (!cancelled) {
          setApiData({ kpis: data.kpis, projects: data.projects, trend: data.trend });
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
      return tourismKpis;
    }
    return tourismKpis.map((item) => {
      if (item.id === 't1') return { ...item, value: '14', trend: '较上月 +2 场' };
      if (item.id === 't2') return { ...item, value: '9', trend: '占比 58%' };
      if (item.id === 't3') return { ...item, value: '29%', trend: '较上月 +2%' };
      if (item.id === 't4') return { ...item, value: '231 万元', trend: '较上月 +9%' };
      return item;
    });
  }, [apiData, quarter]);

  const adjustedProjects = (apiData?.projects ?? tourismProjects).map((item) => {
    if (quarter === '2026Q2') {
      return item;
    }
    return {
      ...item,
      budgetExecution: Math.max(35, item.budgetExecution - 8),
      progress: Math.max(20, item.progress - 10)
    };
  });

  const adjustedTrend = (apiData?.trend ?? tourismTrend).map((item) => {
    if (quarter === '2026Q2') {
      return item;
    }
    return {
      ...item,
      events: Math.max(4, item.events - 2),
      conversion: Math.max(18, item.conversion - 4)
    };
  });

  const handleGeneratePlan = () => {
    setPlanText(
      '建议在杏花村景区设置“文化讲解 + 品鉴预约 + 终端导购”三段式路径，并将华东与华中作为联动试点城市。'
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-mlan">文旅联动专题</h3>
            <p className="mt-1 text-sm text-slate-600">
              以杏花村酒文化为核心，连接品牌传播、游客体验、文创消费与渠道转化。
            </p>
          </div>
          <button
            onClick={handleGeneratePlan}
            className="rounded-xl border border-dianqing/30 bg-dianqing/5 px-3 py-2 text-xs font-medium text-dianqing transition hover:bg-dianqing/10"
          >
            一键生成文旅联动策划
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">当前周期：{quarter === '2026Q2' ? '2026 年 Q2' : '2026 年 Q1'}</p>
        <p className={`mt-1 text-xs ${apiConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
          {apiConnected ? '文旅数据来自后端接口' : '文旅数据当前使用前端兜底'}
        </p>
        {planText && <p className="mt-3 rounded-xl bg-mist/60 p-3 text-xs text-slate-700">{planText}</p>}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {adjustedKpis.map((item) => (
          <KpiCard key={item.id} item={item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {adjustedProjects.map((project, idx) => (
          <article
            key={project.id}
            className={`rounded-2xl border bg-white p-5 shadow-card transition hover:-translate-y-0.5 ${
              meetingMode && idx === 0 ? 'border-dianqing/40 ring-1 ring-dianqing/20' : 'border-slate-200'
            }`}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h4 className="font-medium text-slate-800">{project.name}</h4>
              <StatusBadge value={project.status} />
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              <p>参与人数：{project.participants}</p>
              <div>
                <p className="mb-1 text-xs text-slate-500">预算执行</p>
                <ProgressBar value={project.budgetExecution} color="gold" />
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-500">当前进度</p>
                <ProgressBar
                  value={project.progress}
                  color={project.status === '风险预警' ? 'red' : project.status === '已完成' ? 'green' : 'blue'}
                />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-serif text-lg text-mlan">近 6 个月文旅联动趋势</h3>
          <span className="text-xs text-slate-500">活动数与预约转化率联动</span>
        </div>
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={adjustedTrend} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D6E1E8" />
              <XAxis dataKey="month" stroke="#6A7B8A" />
              <YAxis yAxisId="left" stroke="#1E5A8A" />
              <YAxis yAxisId="right" orientation="right" stroke="#1F4E79" tickFormatter={(value) => `${value}%`} />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === '文旅活动数') return [`${value} 场`, name];
                  return [`${value}%`, name];
                }}
                contentStyle={{ borderRadius: 12, borderColor: '#D8E1E8', background: '#FBF9F4' }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="events" name="文旅活动数" stroke="#1E5A8A" strokeWidth={3} dot={{ r: 4 }} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversion"
                name="预约转化率"
                stroke="#1F4E79"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-dianqing/20 bg-gradient-to-r from-white to-mist/65 p-5 shadow-card">
        <h3 className="font-serif text-lg text-mlan">酒文化不止是传播内容，也是业务连接器</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
          {tourismValues.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white/85 p-4">
              <h4 className="mb-2 font-medium text-qinghua">{item.title}</h4>
              <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
