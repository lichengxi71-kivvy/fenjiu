import { BrandActivityItem, QuarterKey, SupervisionItem } from '../types';

interface OverviewResponse {
  quarter: QuarterKey;
  kpis: {
    activities: number;
    dealers: number;
    provinces: number;
    completionRate: number;
    pendingCount: number;
  };
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function fetchOverview(quarter: QuarterKey) {
  return request<OverviewResponse>(`/api/overview?quarter=${quarter}`);
}

export function fetchActivities() {
  return request<BrandActivityItem[]>('/api/activities');
}

export function createActivity(payload: Partial<BrandActivityItem>) {
  return request<BrandActivityItem>('/api/activities', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function fetchSupervisions() {
  return request<SupervisionItem[]>('/api/supervision');
}

export function patchSupervisionStatus(id: string, status: SupervisionItem['status']) {
  return request<SupervisionItem>(`/api/supervision/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export function fetchAiSuggestion(issue?: string) {
  return request<{ content: string }>('/api/ai/suggestion', {
    method: 'POST',
    body: JSON.stringify({ issue })
  });
}

export function fetchTourism(quarter: QuarterKey) {
  return request<{
    quarter: QuarterKey;
    kpis: Array<{
      id: string;
      title: string;
      value: string;
      trend: string;
      trendType: 'up' | 'down' | 'neutral';
      icon: string;
    }>;
    projects: Array<{
      id: string;
      name: string;
      status: '未开始' | '进行中' | '已完成' | '风险预警';
      participants: string;
      budgetExecution: number;
      progress: number;
    }>;
    trend: Array<{ month: string; events: number; conversion: number }>;
  }>(`/api/tourism?quarter=${quarter}`);
}

export function fetchDealer(quarter: QuarterKey) {
  return request<{
    quarter: QuarterKey;
    kpis: Array<{
      id: string;
      title: string;
      value: string;
      trend: string;
      trendType: 'up' | 'down' | 'neutral';
      icon: string;
    }>;
    executionRows: Array<{
      region: string;
      enrolled: number;
      executed: number;
      materialRate: number;
      feedbackRate: number;
      score: number;
    }>;
    participationTrend: Array<{ region: string; rate: number }>;
    warnings: Array<{ region: string; rate: number; issue: string; impact: string }>;
  }>(`/api/dealer?quarter=${quarter}`);
}
