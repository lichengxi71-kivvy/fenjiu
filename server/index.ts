import cors from 'cors';
import express from 'express';
import {
  aiSuggestionText,
  brandActivityRows,
  dealerExecutionRows,
  dealerKpis,
  dealerParticipationTrend,
  lowParticipationWarnings,
  supervisionItems,
  tourismKpis,
  tourismProjects,
  tourismTrend
} from '../src/data/mockData';
import { ActivityStatus, BrandActivityItem, QuarterKey, SupervisionItem, SupervisionStatus } from '../src/types';

const app = express();
app.use(cors());
app.use(express.json());

function now() {
  return new Date().toLocaleString('zh-CN', { hour12: false });
}

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${now()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

let activities: BrandActivityItem[] = structuredClone(brandActivityRows);
let supervisions: SupervisionItem[] = structuredClone(supervisionItems);

const quarterScale: Record<QuarterKey, number> = {
  '2026Q2': 1,
  '2026Q1': 0.89
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'fenjiu-prototype-api' });
});

app.get('/api/overview', (req, res) => {
  const quarter = (req.query.quarter as QuarterKey) || '2026Q2';
  const scale = quarterScale[quarter] ?? 1;
  const completed = activities.filter((item) => item.status === '已完成').length;
  const completionRate = Math.round((completed / Math.max(activities.length, 1)) * 100);
  const pendingCount = supervisions.filter((item) => item.status === '待处理' || item.status === '处理中').length;

  res.json({
    quarter,
    kpis: {
      activities: Math.round(128 * scale),
      dealers: Math.round(864 * scale),
      provinces: Math.round(28 * (quarter === '2026Q2' ? 1 : 0.93)),
      completionRate: quarter === '2026Q2' ? Math.max(completionRate, 76) : Math.max(completionRate - 7, 66),
      pendingCount: quarter === '2026Q2' ? Math.max(pendingCount, 12) : Math.max(pendingCount + 3, 15)
    }
  });
});

app.get('/api/activities', (_req, res) => {
  res.json(activities);
});

app.post('/api/activities', (req, res) => {
  const body = req.body as Partial<BrandActivityItem>;
  if (!body.name || !body.brand || !body.type || !body.region || !body.owner) {
    res.status(400).json({ message: '活动字段不完整' });
    return;
  }

  const item: BrandActivityItem = {
    id: `act-${Date.now()}`,
    name: body.name,
    brand: body.brand,
    type: body.type,
    region: body.region,
    owner: body.owner,
    budget: Number(body.budget ?? 0),
    progress: Number(body.progress ?? 0),
    status: (body.status as ActivityStatus) ?? '未开始',
    description: body.description ?? ''
  };

  activities = [item, ...activities];
  console.log(`[${now()}] [Activity] Created: ${item.name}`);
  res.status(201).json(item);
});

app.get('/api/supervision', (_req, res) => {
  res.json(supervisions);
});

app.patch('/api/supervision/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status?: SupervisionStatus };
  if (!status) {
    res.status(400).json({ message: '缺少 status 字段' });
    return;
  }

  const target = supervisions.find((item) => item.id === id);
  if (!target) {
    res.status(404).json({ message: '督办事项不存在' });
    return;
  }

  target.status = status;
  console.log(`[${now()}] [Supervision] ${target.task} -> ${status}`);
  res.json(target);
});

app.post('/api/ai/suggestion', (req, res) => {
  const issue = (req.body?.issue as string | undefined) ?? '';
  res.json({
    content: issue ? `针对“${issue}”，${aiSuggestionText}` : aiSuggestionText
  });
});

app.get('/api/tourism', (req, res) => {
  const quarter = (req.query.quarter as QuarterKey) || '2026Q2';
  const isQ2 = quarter === '2026Q2';

  const kpis = isQ2
    ? tourismKpis
    : tourismKpis.map((item) => {
        if (item.id === 't1') return { ...item, value: '14', trend: '较上月 +2 场' };
        if (item.id === 't2') return { ...item, value: '9', trend: '占比 58%' };
        if (item.id === 't3') return { ...item, value: '29%', trend: '较上月 +2%' };
        if (item.id === 't4') return { ...item, value: '231 万元', trend: '较上月 +9%' };
        return item;
      });

  const projects = isQ2
    ? tourismProjects
    : tourismProjects.map((item) => ({
        ...item,
        budgetExecution: Math.max(35, item.budgetExecution - 8),
        progress: Math.max(20, item.progress - 10)
      }));

  const trend = isQ2
    ? tourismTrend
    : tourismTrend.map((item) => ({
        ...item,
        events: Math.max(4, item.events - 2),
        conversion: Math.max(18, item.conversion - 4)
      }));

  res.json({ quarter, kpis, projects, trend });
});

app.get('/api/dealer', (req, res) => {
  const quarter = (req.query.quarter as QuarterKey) || '2026Q2';
  const isQ2 = quarter === '2026Q2';

  const kpis = isQ2
    ? dealerKpis
    : dealerKpis.map((item) => {
        if (item.id === 'd1') return { ...item, value: '1,248', trend: '季度净增 21 家' };
        if (item.id === 'd2') return { ...item, value: '792', trend: '参与覆盖 63%' };
        if (item.id === 'd3') return { ...item, value: '69%', trend: '较上月 +1%' };
        if (item.id === 'd4') return { ...item, value: '4', trend: '较上月 +1' };
        return item;
      });

  const executionRows = isQ2
    ? dealerExecutionRows
    : dealerExecutionRows.map((row) => ({
        ...row,
        executed: Math.max(60, row.executed - 12),
        materialRate: Math.max(55, row.materialRate - 5),
        feedbackRate: Math.max(48, row.feedbackRate - 6),
        score: Math.max(3.1, Number((row.score - 0.2).toFixed(1)))
      }));

  const participationTrend = isQ2
    ? dealerParticipationTrend
    : dealerParticipationTrend.map((row) => ({ ...row, rate: Math.max(45, row.rate - 6) }));

  const warnings = isQ2
    ? lowParticipationWarnings
    : lowParticipationWarnings.map((row) => ({ ...row, rate: Math.max(50, row.rate - 4) }));

  res.json({ quarter, kpis, executionRows, participationTrend, warnings });
});

const port = 3001;
app.listen(port, () => {
  console.log(`[${now()}] Fenjiu prototype API running at http://127.0.0.1:${port}`);
});
