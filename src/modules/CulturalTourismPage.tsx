import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { KpiCard } from '../components/ui/KpiCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { tourismKpis, tourismProjects, tourismTrend, tourismValues } from '../data/mockData';

export function CulturalTourismPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="font-serif text-xl text-mlan">文旅联动专题</h3>
        <p className="mt-1 text-sm text-slate-600">
          以杏花村酒文化为核心，连接品牌传播、游客体验、文创消费与渠道转化。
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {tourismKpis.map((item) => (
          <KpiCard key={item.id} item={item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {tourismProjects.map((project) => (
          <article
            key={project.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5"
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
            <LineChart data={tourismTrend} margin={{ top: 10, right: 24, left: 12, bottom: 6 }}>
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
