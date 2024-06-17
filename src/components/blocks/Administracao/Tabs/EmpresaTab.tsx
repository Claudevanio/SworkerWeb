import { useAdministrator } from '@/contexts/AdministrationProvider';
import { RoundedTab } from '../../tabs';
import { CompanyTab } from './EmpresaTabsFolder/Company';
import { useEffect } from 'react';
export function EmpresasTab({ activeTab, setActiveTab }: { activeTab: number; setActiveTab: (value: number) => void }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <CompanyTab />
    </div>
  );
}
