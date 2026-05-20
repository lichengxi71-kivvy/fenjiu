import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { createActivity, fetchActivities } from '../api/client';
import { brandActivityRows, brandActivitySummary, brandFilterOptions } from '../data/mockData';
import { BrandActivityItem, QuarterKey } from '../types';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';

interface BrandActivityPageProps {
  quarter: QuarterKey;
  meetingMode: boolean;
}

type FilterState = {
  brand: string;
  type: string;
  status: string;
  region: string;
};

const initialFilter: FilterState = {
  brand: '全部',
  type: '全部',
  status: '全部',
  region: '全部'
};

const initialForm = {
  name: '',
  brand: '汾酒' as BrandActivityItem['brand'],
  type: '经销商品鉴会' as BrandActivityItem['type'],
  region: '华北' as BrandActivityItem['region'],
  budget: '',
  owner: '',
  startDate: '',
  endDate: '',
  description: ''
};

export function BrandActivityPage({ quarter, meetingMode }: BrandActivityPageProps) {
  const [rows, setRows] = useState<BrandActivityItem[]>(brandActivityRows);
  const [filters, setFilters] = useState<FilterState>(initialFilter);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [templateMsg, setTemplateMsg] = useState('');
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    if (meetingMode) {
      setFilters({ ...initialFilter, status: '风险预警' });
    }
  }, [meetingMode]);

  useEffect(() => {
    let cancelled = false;
    fetchActivities()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setRows(data);
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

  const quarterRows = useMemo(() => {
    if (quarter === '2026Q2') {
      return rows;
    }
    return rows.map((row) => ({
      ...row,
      progress: Math.max(0, row.progress - 8),
      budget: Math.max(10, row.budget - 12)
    }));
  }, [quarter, rows]);

  const filteredRows = useMemo(() => {
    return quarterRows.filter((item) => {
      const matchBrand = filters.brand === '全部' || item.brand === filters.brand;
      const matchType = filters.type === '全部' || item.type === filters.type;
      const matchStatus = filters.status === '全部' || item.status === filters.status;
      const matchRegion = filters.region === '全部' || item.region === filters.region;
      return matchBrand && matchType && matchStatus && matchRegion;
    });
  }, [filters, quarterRows]);

  const summary = useMemo(() => {
    if (quarter === '2026Q2') {
      return brandActivitySummary;
    }
    return {
      ongoing: 39,
      completed: 55,
      warning: 13,
      newThisMonth: 8
    };
  }, [quarter]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.owner.trim() || !form.budget.trim()) {
      return;
    }

    const newItem: BrandActivityItem = {
      id: `act-${Date.now()}`,
      name: form.name,
      brand: form.brand,
      type: form.type,
      region: form.region,
      owner: form.owner,
      budget: Number(form.budget),
      progress: 0,
      status: '未开始',
      description: form.description
    };

    createActivity(newItem)
      .then((saved) => {
        setRows((prev) => [saved, ...prev]);
        setApiConnected(true);
      })
      .catch(() => {
        setRows((prev) => [newItem, ...prev]);
        setApiConnected(false);
      });
    setForm(initialForm);
    setIsModalOpen(false);
  };

  const handleCreateTemplate = () => {
    const template: BrandActivityItem = {
      id: `tpl-${Date.now()}`,
      name: '汾酒清香品鉴会（模板）',
      brand: '汾酒',
      type: '经销商品鉴会',
      region: '华东',
      owner: '总部模板',
      budget: 130,
      progress: 15,
      status: '进行中',
      description: '用于现场快速演示的标准化活动模板。'
    };
    createActivity(template)
      .then((saved) => {
        setRows((prev) => [saved, ...prev]);
        setApiConnected(true);
        setTemplateMsg('已自动创建模板活动，可继续编辑并提交执行。');
      })
      .catch(() => {
        setRows((prev) => [template, ...prev]);
        setApiConnected(false);
        setTemplateMsg('后端未连接，已使用本地演示数据创建模板活动。');
      })
      .finally(() => {
        window.setTimeout(() => setTemplateMsg(''), 2600);
      });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-mlan">品牌活动管理</h3>
            <p className="mt-1 text-sm text-slate-600">
              统一管理汾酒、竹叶青、杏花村品牌活动，从申报、执行到复盘全过程协同。
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateTemplate}
              className="rounded-xl border border-dianqing/30 bg-dianqing/5 px-3 py-2 text-xs font-medium text-dianqing transition hover:bg-dianqing/10"
            >
              一键新建模板活动
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-dianqing px-4 py-2 text-sm font-medium text-white transition hover:bg-qinghua"
            >
              新建活动
            </button>
          </div>
        </div>

        <div className="mb-3 text-xs text-slate-500">当前周期：{quarter === '2026Q2' ? '2026 年 Q2' : '2026 年 Q1'}</div>
        <div className={`mb-3 text-xs ${apiConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
          {apiConnected ? '活动数据来自后端接口' : '活动数据当前使用前端兜底'}
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Object.entries(brandFilterOptions).map(([key, options]) => (
            <label key={key} className="text-sm">
              <span className="mb-1 block text-slate-600">
                {key === 'brand' ? '所属品牌' : key === 'type' ? '活动类型' : key === 'status' ? '活动状态' : '区域'}
              </span>
              <select
                value={filters[key as keyof FilterState]}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, [key]: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-paper px-3 py-2 text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-dianqing/30"
              >
                {options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
        {templateMsg && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{templateMsg}</p>}
      </section>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <SummaryCard title="进行中活动" value={summary.ongoing} color="text-dianqing" />
        <SummaryCard title="已完成活动" value={summary.completed} color="text-emerald-600" />
        <SummaryCard title="风险预警活动" value={summary.warning} color="text-sealred" />
        <SummaryCard title="本月新增活动" value={summary.newThisMonth} color="text-mutedgold" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-mist/70 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">活动名称</th>
                <th className="px-4 py-3 text-left font-medium">所属品牌</th>
                <th className="px-4 py-3 text-left font-medium">活动类型</th>
                <th className="px-4 py-3 text-left font-medium">所属区域</th>
                <th className="px-4 py-3 text-left font-medium">负责人</th>
                <th className="px-4 py-3 text-left font-medium">预算</th>
                <th className="px-4 py-3 text-left font-medium">当前进度</th>
                <th className="px-4 py-3 text-left font-medium">活动状态</th>
                <th className="px-4 py-3 text-left font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const spotlight = meetingMode && row.status === '风险预警';
                return (
                  <tr
                    key={row.id}
                    className={`border-t border-slate-100 transition hover:bg-mist/35 ${spotlight ? 'bg-sealred/5' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{row.name}</td>
                    <td className="px-4 py-3">{row.brand}</td>
                    <td className="px-4 py-3">{row.type}</td>
                    <td className="px-4 py-3">{row.region}</td>
                    <td className="px-4 py-3">{row.owner}</td>
                    <td className="px-4 py-3">{row.budget} 万</td>
                    <td className="w-52 px-4 py-3">
                      <ProgressBar
                        value={row.progress}
                        color={row.status === '风险预警' ? 'red' : row.status === '已完成' ? 'green' : 'blue'}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button className="rounded-lg border border-dianqing/25 px-2.5 py-1 text-xs text-dianqing transition hover:bg-dianqing/10">
                        查看
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={isModalOpen} title="新建品牌活动" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="活动名称">
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="input"
                placeholder="请输入活动名称"
              />
            </Field>
            <Field label="选择品牌">
              <select
                value={form.brand}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, brand: event.target.value as BrandActivityItem['brand'] }))
                }
                className="input"
              >
                <option>汾酒</option>
                <option>竹叶青</option>
                <option>杏花村</option>
              </select>
            </Field>
            <Field label="活动类型">
              <select
                value={form.type}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, type: event.target.value as BrandActivityItem['type'] }))
                }
                className="input"
              >
                <option>经销商品鉴会</option>
                <option>文化巡展</option>
                <option>文旅联动</option>
                <option>终端促销</option>
                <option>新品发布</option>
              </select>
            </Field>
            <Field label="所属区域">
              <select
                value={form.region}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, region: event.target.value as BrandActivityItem['region'] }))
                }
                className="input"
              >
                <option>华北</option>
                <option>华东</option>
                <option>华南</option>
                <option>华中</option>
                <option>西北</option>
              </select>
            </Field>
            <Field label="预算（万）">
              <input
                value={form.budget}
                onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
                className="input"
                placeholder="例如 120"
              />
            </Field>
            <Field label="负责人">
              <input
                value={form.owner}
                onChange={(event) => setForm((prev) => ({ ...prev, owner: event.target.value }))}
                className="input"
                placeholder="请输入负责人"
              />
            </Field>
            <Field label="预期开始时间">
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
                className="input"
              />
            </Field>
            <Field label="预期结束时间">
              <input
                type="date"
                value={form.endDate}
                onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
                className="input"
              />
            </Field>
          </div>
          <Field label="活动说明">
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="input min-h-24"
              placeholder="填写活动背景、目标与执行要点"
            />
          </Field>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded-xl bg-dianqing px-4 py-2 text-sm font-medium text-white transition hover:bg-qinghua"
            >
              提交活动
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function SummaryCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5">
      <p className="text-sm text-slate-600">{title}</p>
      <p className={`mt-2 font-serif text-3xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-slate-600">{label}</span>
      {children}
    </label>
  );
}
