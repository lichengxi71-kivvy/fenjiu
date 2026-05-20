import { useMemo, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BrandActivityPage } from './modules/BrandActivityPage';
import { CulturalTourismPage } from './modules/CulturalTourismPage';
import { DealerCollabPage } from './modules/DealerCollabPage';
import { OverviewPage } from './modules/OverviewPage';
import { SupervisionPage } from './modules/SupervisionPage';
import { ModuleKey } from './types';

function App() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('overview');

  const moduleView = useMemo(() => {
    if (activeModule === 'brandActivity') return <BrandActivityPage />;
    if (activeModule === 'culturalTourism') return <CulturalTourismPage />;
    if (activeModule === 'dealerCollab') return <DealerCollabPage />;
    if (activeModule === 'supervision') return <SupervisionPage />;
    return <OverviewPage />;
  }, [activeModule]);

  return (
    <div className="relative min-h-screen bg-paper text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(30,90,138,0.09),transparent_48%),radial-gradient(circle_at_80%_8%,rgba(31,78,121,0.06),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply [background-image:linear-gradient(120deg,rgba(16,42,67,0.04)_1px,transparent_1px),linear-gradient(300deg,rgba(16,42,67,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative flex min-h-screen">
        <Sidebar active={activeModule} onChange={setActiveModule} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 px-8 py-6">
            <div key={activeModule} className="animate-fadeIn">
              {moduleView}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
