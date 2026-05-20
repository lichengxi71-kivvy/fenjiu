import {
  BrandActivityItem,
  KPIItem,
  SupervisionItem,
  ActivityStatus,
  ModuleKey
} from '../types';

export const navItems: Array<{ key: ModuleKey; label: string; icon: string }> = [
  { key: 'overview', label: '集团总览', icon: '总' },
  { key: 'brandActivity', label: '品牌活动管理', icon: '品' },
  { key: 'culturalTourism', label: '文旅联动专题', icon: '文' },
  { key: 'dealerCollab', label: '经销商协同', icon: '销' },
  { key: 'supervision', label: '异常督办中心', icon: '督' }
];

export const overviewKpis: KPIItem[] = [
  {
    id: 'k1',
    title: '本季度品牌活动总数',
    value: '128',
    trend: '较上季度 +18%',
    trendType: 'up',
    icon: '活动'
  },
  {
    id: 'k2',
    title: '参与经销商数量',
    value: '864',
    trend: '较去年同期 +12%',
    trendType: 'up',
    icon: '渠道'
  },
  {
    id: 'k3',
    title: '全国覆盖省份',
    value: '28',
    trend: '新增覆盖 2 省',
    trendType: 'up',
    icon: '覆盖'
  },
  {
    id: 'k4',
    title: '已完成活动占比',
    value: '76%',
    trend: '环比 +4%',
    trendType: 'up',
    icon: '完成'
  },
  {
    id: 'k5',
    title: '待督办事项数',
    value: '12',
    trend: '环比 -2 项',
    trendType: 'down',
    icon: '督办'
  }
];

export const brandStructure = [
  { name: '汾酒', value: 58 },
  { name: '竹叶青', value: 36 },
  { name: '杏花村', value: 34 }
];

export const regionalExecution = [
  { region: '华北', completion: 88, budget: 74, participation: 82 },
  { region: '华东', completion: 71, budget: 81, participation: 58 },
  { region: '华南', completion: 79, budget: 67, participation: 62 },
  { region: '华中', completion: 84, budget: 72, participation: 77 },
  { region: '西北', completion: 69, budget: 64, participation: 55 }
];

export const overviewAlerts = [
  {
    id: 'alert-1',
    priority: '高',
    title: '华东区域经销商参与率低于 60%',
    module: '经销商协同',
    detail:
      '建议总部与区域销售部联合排查报名转执行流失节点，并对低活跃城市进行专项回访。'
  },
  {
    id: 'alert-2',
    priority: '中',
    title: '某重点品牌活动预算使用率超过 90%',
    module: '品牌活动管理',
    detail: '需核查投放节奏与费用结构，防止后续执行阶段预算不足。'
  },
  {
    id: 'alert-3',
    priority: '中',
    title: '杏花村文旅联动项目执行进度滞后',
    module: '文旅联动专题',
    detail: '建议增加周度督办频次，优先保障核心体验节点如预约导览与品鉴环节。'
  },
  {
    id: 'alert-4',
    priority: '低',
    title: '西北区域终端促销反馈率不足',
    module: '异常督办中心',
    detail: '建议优化终端反馈模板，缩短填报链路并同步小程序提醒机制。'
  }
];

export const platformValues = [
  '快速生成集团级业务管理原型',
  '连接品牌活动、渠道执行与文旅运营',
  '从数据洞察延展到异常督办闭环'
];

export const brandFilterOptions = {
  brand: ['全部', '汾酒', '竹叶青', '杏花村'],
  type: ['全部', '经销商品鉴会', '文化巡展', '文旅联动', '终端促销', '新品发布'],
  status: ['全部', '未开始', '进行中', '已完成', '风险预警'],
  region: ['全部', '华北', '华东', '华南', '华中', '西北']
};

export const brandActivityRows: BrandActivityItem[] = [
  {
    id: 'act-1',
    name: '清香汾城市品鉴巡回季',
    brand: '汾酒',
    type: '经销商品鉴会',
    region: '华北',
    owner: '李晨',
    budget: 180,
    progress: 86,
    status: '进行中',
    description: '围绕核心城市商圈门店开展主题品鉴与渠道联动拉新。'
  },
  {
    id: 'act-2',
    name: '竹叶青康养酒文化体验周',
    brand: '竹叶青',
    type: '新品发布',
    region: '华东',
    owner: '王悦',
    budget: 120,
    progress: 64,
    status: '风险预警',
    description: '与康养场景合作开展体验活动，当前渠道执行节奏偏慢。'
  },
  {
    id: 'act-3',
    name: '杏花村酒文化巡展',
    brand: '杏花村',
    type: '文化巡展',
    region: '华中',
    owner: '张楠',
    budget: 95,
    progress: 100,
    status: '已完成',
    description: '完成核心城市巡展节点，形成文化传播与门店转化联动。'
  },
  {
    id: 'act-4',
    name: '汾酒终端陈列提升计划',
    brand: '汾酒',
    type: '终端促销',
    region: '华南',
    owner: '陈立',
    budget: 150,
    progress: 52,
    status: '进行中',
    description: '聚焦终端动销与陈列规范化，分阶段推进。'
  },
  {
    id: 'act-5',
    name: '杏花村文旅联动推广月',
    brand: '杏花村',
    type: '文旅联动',
    region: '西北',
    owner: '赵欣',
    budget: 88,
    progress: 41,
    status: '风险预警',
    description: '景区流量导入阶段受阻，需加强区域联动执行。'
  }
];

export const brandActivitySummary = {
  ongoing: 46,
  completed: 62,
  warning: 9,
  newThisMonth: 11
};

export const tourismKpis: KPIItem[] = [
  {
    id: 't1',
    title: '本月文旅联动活动数',
    value: '18',
    trend: '较上月 +3 场',
    trendType: 'up',
    icon: '联动'
  },
  {
    id: 't2',
    title: '杏花村相关活动数',
    value: '11',
    trend: '占比 61%',
    trendType: 'neutral',
    icon: '文化'
  },
  {
    id: 't3',
    title: '游客预约转化率',
    value: '34%',
    trend: '较上月 +3%',
    trendType: 'up',
    icon: '转化'
  },
  {
    id: 't4',
    title: '文创商品销售额',
    value: '286 万元',
    trend: '较上月 +14%',
    trendType: 'up',
    icon: '销售'
  }
];

export const tourismProjects = [
  {
    id: 'tp1',
    name: '杏花村酒文化沉浸式体验季',
    status: '进行中' as ActivityStatus,
    participants: '12,600',
    budgetExecution: 72,
    progress: 68
  },
  {
    id: 'tp2',
    name: '汾酒文化景区品牌联动周',
    status: '已完成' as ActivityStatus,
    participants: '8,900',
    budgetExecution: 93,
    progress: 100
  },
  {
    id: 'tp3',
    name: '竹叶青康养酒文化品鉴活动',
    status: '风险预警' as ActivityStatus,
    participants: '3,200',
    budgetExecution: 61,
    progress: 42
  }
];

export const tourismTrend = [
  { month: '1月', events: 6, conversion: 21 },
  { month: '2月', events: 8, conversion: 24 },
  { month: '3月', events: 10, conversion: 26 },
  { month: '4月', events: 12, conversion: 29 },
  { month: '5月', events: 15, conversion: 31 },
  { month: '6月', events: 18, conversion: 34 }
];

export const tourismValues = [
  {
    title: '品牌文化传播',
    desc: '通过杏花村酒文化与场景叙事，持续强化品牌情感认同。'
  },
  {
    title: '景区流量转化',
    desc: '把景区游客预约行为转化为可衡量的品牌体验与消费动作。'
  },
  {
    title: '消费场景联动',
    desc: '打通文旅活动、渠道推广与集团营销节奏，形成协同增长。'
  }
];

export const dealerKpis: KPIItem[] = [
  {
    id: 'd1',
    title: '经销商总数',
    value: '1,286',
    trend: '季度净增 38 家',
    trendType: 'up',
    icon: '规模'
  },
  {
    id: 'd2',
    title: '已参与活动经销商数',
    value: '864',
    trend: '参与覆盖 67%',
    trendType: 'neutral',
    icon: '参与'
  },
  {
    id: 'd3',
    title: '平均执行率',
    value: '73%',
    trend: '较上月 +2%',
    trendType: 'up',
    icon: '执行'
  },
  {
    id: 'd4',
    title: '低活跃区域数',
    value: '3',
    trend: '较上月持平',
    trendType: 'neutral',
    icon: '风险'
  }
];

export const dealerExecutionRows = [
  {
    region: '华北',
    enrolled: 226,
    executed: 198,
    materialRate: 91,
    feedbackRate: 86,
    score: 4.7
  },
  {
    region: '华东',
    enrolled: 248,
    executed: 144,
    materialRate: 73,
    feedbackRate: 61,
    score: 3.6
  },
  {
    region: '华南',
    enrolled: 206,
    executed: 128,
    materialRate: 78,
    feedbackRate: 66,
    score: 3.9
  },
  {
    region: '华中',
    enrolled: 194,
    executed: 151,
    materialRate: 84,
    feedbackRate: 79,
    score: 4.3
  },
  {
    region: '西北',
    enrolled: 182,
    executed: 100,
    materialRate: 69,
    feedbackRate: 58,
    score: 3.4
  }
];

export const dealerParticipationTrend = [
  { region: '华北', rate: 88 },
  { region: '华东', rate: 58 },
  { region: '华南', rate: 62 },
  { region: '华中', rate: 78 },
  { region: '西北', rate: 55 }
];

export const lowParticipationWarnings = [
  {
    region: '华东',
    rate: 58,
    issue: '报名到执行流失率偏高，重点城市执行督导不足。',
    impact: '可能影响新品活动覆盖密度与重点门店转化表现。'
  },
  {
    region: '西北',
    rate: 55,
    issue: '终端促销反馈回收慢，区域物料协同效率偏低。',
    impact: '影响总部对区域活动成效的复盘与资源再分配。'
  },
  {
    region: '华南',
    rate: 62,
    issue: '活动组织节奏不稳定，部分渠道复投意愿下滑。',
    impact: '会拖慢季度活动节奏，增加临时调整成本。'
  }
];

export const supervisionItems: SupervisionItem[] = [
  {
    id: 's1',
    task: '华东区域经销商参与率偏低',
    issueType: '渠道执行',
    region: '华东',
    department: '渠道管理部',
    owner: '刘敏',
    deadline: '2026-06-10',
    priority: '高',
    status: '处理中',
    summary: '华东区域报名经销商到执行经销商转化低于预期。',
    reasons: ['活动物料反馈不及时', '区域激励政策传达不足', '重点城市资源投入不足'],
    actions: ['重点拜访低活跃经销商', '针对终端执行制定专项激励', '每周同步执行进度与反馈闭环'],
    progress: '已完成重点城市名单梳理，正在落实分层激励方案。',
    expectedDate: '2026-06-10'
  },
  {
    id: 's2',
    task: '杏花村文旅项目进度滞后',
    issueType: '项目推进',
    region: '华中',
    department: '品牌文化部',
    owner: '李航',
    deadline: '2026-06-18',
    priority: '中',
    status: '待处理',
    summary: '文旅项目阶段里程碑未按计划推进。',
    reasons: ['跨部门协调节奏不一致', '场地排期变动频繁'],
    actions: ['建立周度推进例会', '拆分里程碑并明确责任人'],
    progress: '待项目组确认调整后的节点计划。',
    expectedDate: '2026-06-18'
  },
  {
    id: 's3',
    task: '某品牌活动预算消耗过快',
    issueType: '预算控制',
    region: '华北',
    department: '市场运营部',
    owner: '周倩',
    deadline: '2026-06-08',
    priority: '高',
    status: '已逾期',
    summary: '前半程投放过密，预算使用率已超过预警阈值。',
    reasons: ['线下投放频次过高', '费用审批缺少分段控制'],
    actions: ['压缩非核心投放', '设置分段费用复核节点'],
    progress: '整改方案初稿已提交，等待总部复核。',
    expectedDate: '2026-06-12'
  },
  {
    id: 's4',
    task: '西北区域终端促销反馈率不足',
    issueType: '终端反馈',
    region: '西北',
    department: '区域销售部',
    owner: '张杰',
    deadline: '2026-06-15',
    priority: '中',
    status: '待处理',
    summary: '终端反馈回传周期长，影响复盘效率。',
    reasons: ['终端反馈表单填写链路长', '基层门店反馈激励不足'],
    actions: ['优化反馈模板', '增加门店即时反馈激励'],
    progress: '正在评估新版反馈模板上线节奏。',
    expectedDate: '2026-06-15'
  }
];

export const supervisionStatusData = [
  { name: '待处理', value: 5 },
  { name: '处理中', value: 4 },
  { name: '已完成', value: 11 },
  { name: '已逾期', value: 2 }
];

export const aiSuggestionText =
  '针对华东区域经销商参与率偏低的问题，建议优先核查活动报名转执行流失环节，并结合物料领取率、反馈完成率对重点城市开展专项回访。';
