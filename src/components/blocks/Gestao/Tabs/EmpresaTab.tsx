import { useAdministrator } from '@/contexts/AdministrationProvider';
import { RoundedTab } from '../../tabs';
import { CompanyUnityTab } from './EmpresaTabsFolder/CompanyUnity';
import { SectorTab } from './EmpresaTabsFolder/SectorTab';
import { ProfessionalTab } from './EmpresaTabsFolder/Professionals';
import { EquipmentsTab } from './EmpresaTabsFolder/Equipments';
import { useEffect } from 'react';
import { useGestao } from '@/contexts/GestaoProvider';

export function EmpresasTab({ activeTab, setActiveTab }: { activeTab: number; setActiveTab: (value: number) => void }) {
  const tabs = [
    {
      label: 'Setores',
      tabIndex: 0
    },
    {
      label: 'Unidades',
      tabIndex: 1
    },
    {
      label: 'Profissionais',
      tabIndex: 2
    },
    {
      label: 'Equipamentos',
      tabIndex: 3
    }
  ];

  const { companyUnities, equipments, professionals, sectors } = useGestao();

  useEffect(() => {
    if (activeTab === 0) {
      sectors.reset();
      return;
    }
    if (activeTab === 1) {
      companyUnities.reset();
      return;
    }
    if (activeTab === 2) {
      professionals.reset();
      return;
    }
    if (activeTab === 3) {
      equipments.reset();
      return;
    }
  }, [activeTab]);

  const currentTab = () => {
    switch (activeTab) {
      case 0:
        return <SectorTab />;
      case 1:
        return <CompanyUnityTab />;
      case 2:
        return <ProfessionalTab />;
      case 3:
        return <EquipmentsTab />;
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full md:pt-4">
      <RoundedTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {currentTab()}
    </div>
  );
}
