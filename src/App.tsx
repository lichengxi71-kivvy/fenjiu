import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BrandActivityPage } from './modules/BrandActivityPage';
import { CulturalTourismPage } from './modules/CulturalTourismPage';
import { DealerCollabPage } from './modules/DealerCollabPage';
import { OverviewPage } from './modules/OverviewPage';
import { SupervisionPage } from './modules/SupervisionPage';
import { supervisionItems } from './data/mockData';
import { ModuleKey, QuarterKey } from './types';

function App() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('overview');
  const [quarter, setQuarter] = useState<QuarterKey>('2026Q2');
  const [meetingMode, setMeetingMode] = useState(false);
  const [meetingStep, setMeetingStep] = useState(1);
  const [resetSeed, setResetSeed] = useState(0);

  const moduleOrder: ModuleKey[] = ['overview', 'brandActivity', 'culturalTourism', 'dealerCollab', 'supervision'];

  useEffect(() => {
    if (!meetingMode) {
      return;
    }
    let idx = moduleOrder.indexOf(activeModule);
    const timer = window.setInterval(() => {
      idx = (idx + 1) % moduleOrder.length;
      setActiveModule(moduleOrder[idx]);
      setMeetingStep(idx + 1);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [activeModule, meetingMode]);

  const handleToggleMeetingMode = () => {
    setMeetingMode((prev) => {
      if (!prev) {
        setActiveModule('overview');
        setMeetingStep(1);
      }
      return !prev;
    });
  };

  const handleResetDemoData = () => {
    setMeetingMode(false);
    setQuarter('2026Q2');
    setActiveModule('overview');
    setMeetingStep(1);
    setResetSeed((prev) => prev + 1);
  };

  const handleExportChecklist = () => {
    const rows = supervisionItems
      .map(
        (item, index) =>
          `${index + 1}. ${item.task} | ${item.issueType} | ${item.region} | ${item.owner} | ${item.deadline} | ${item.status}`
      )
      .join('\n');
    const content = `清香汾平台-督办清单（${quarter}）\n导出时间：${new Date().toLocaleString('zh-CN')}\n\n${rows}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `汾酒督办清单-${quarter}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const moduleView = useMemo(() => {
    if (activeModule === 'brandActivity') {
      return <BrandActivityPage quarter={quarter} key={`brand-${resetSeed}`} meetingMode={meetingMode} />;
    }
    if (activeModule === 'culturalTourism') {
      return <CulturalTourismPage quarter={quarter} key={`tour-${resetSeed}`} meetingMode={meetingMode} />;
    }
    if (activeModule === 'dealerCollab') {
      return <DealerCollabPage quarter={quarter} key={`dealer-${resetSeed}`} meetingMode={meetingMode} />;
    }
    if (activeModule === 'supervision') {
      return <SupervisionPage quarter={quarter} key={`super-${resetSeed}`} meetingMode={meetingMode} />;
    }
    return <OverviewPage quarter={quarter} key={`overview-${resetSeed}`} meetingMode={meetingMode} />;
  }, [activeModule, meetingMode, quarter, resetSeed]);

  return (
    <div className="relative min-h-screen bg-paper text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(30,90,138,0.09),transparent_48%),radial-gradient(circle_at_80%_8%,rgba(31,78,121,0.06),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply [background-image:linear-gradient(120deg,rgba(16,42,67,0.04)_1px,transparent_1px),linear-gradient(300deg,rgba(16,42,67,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative flex min-h-screen">
        <Sidebar active={activeModule} onChange={setActiveModule} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            quarter={quarter}
            meetingMode={meetingMode}
            meetingStep={meetingStep}
            onQuarterChange={setQuarter}
            onToggleMeetingMode={handleToggleMeetingMode}
            onResetDemoData={handleResetDemoData}
            onExportChecklist={handleExportChecklist}
          />
          <main className="flex-1 px-8 py-6">
            <div key={`${activeModule}-${quarter}-${resetSeed}`} className="animate-fadeIn">
              {moduleView}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
