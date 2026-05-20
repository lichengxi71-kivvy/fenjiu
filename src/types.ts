export type ModuleKey =
  | 'overview'
  | 'brandActivity'
  | 'culturalTourism'
  | 'dealerCollab'
  | 'supervision';

export type PriorityLevel = '高' | '中' | '低';
export type ActivityStatus = '未开始' | '进行中' | '已完成' | '风险预警';
export type SupervisionStatus = '待处理' | '处理中' | '已完成' | '已逾期';

export interface KPIItem {
  id: string;
  title: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface BrandActivityItem {
  id: string;
  name: string;
  brand: '汾酒' | '竹叶青' | '杏花村';
  type: '经销商品鉴会' | '文化巡展' | '文旅联动' | '终端促销' | '新品发布';
  region: '华北' | '华东' | '华南' | '华中' | '西北';
  owner: string;
  budget: number;
  progress: number;
  status: ActivityStatus;
  description?: string;
}

export interface SupervisionItem {
  id: string;
  task: string;
  issueType: '渠道执行' | '项目推进' | '预算控制' | '终端反馈';
  region: '华北' | '华东' | '华南' | '华中' | '西北';
  department: string;
  owner: string;
  deadline: string;
  priority: PriorityLevel;
  status: SupervisionStatus;
  summary: string;
  reasons: string[];
  actions: string[];
  progress: string;
  expectedDate: string;
}
