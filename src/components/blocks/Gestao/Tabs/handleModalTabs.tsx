import { useAdministrator } from '@/contexts/AdministrationProvider';
import { AdministrationModals } from '../Overlay';
import { useGestao } from '@/contexts/GestaoProvider';

export function ModalTabs({ tab, subtab }: { tab: number; subtab: number }) {
  const { modal, companyUnities, sectors, professionals, equipments } = useGestao();

  if (!modal.isOpen) return null;

  switch (subtab) {
    case 0:
      return <AdministrationModals.ModalSector isOpen={modal.isOpen} onClose={modal.close} current={sectors.current} readonly={sectors.readonly} />;
    case 1:
      return (
        <AdministrationModals.ModalCompanyUnity
          isOpen={modal.isOpen}
          onClose={modal.close}
          current={companyUnities.current}
          readonly={companyUnities.readonly}
        />
      );
    case 2:
      return (
        <AdministrationModals.ModalProfessional
          isOpen={modal.isOpen}
          onClose={modal.close}
          current={professionals.current}
          readonly={professionals.readonly}
        />
      );
    case 3:
      return (
        <AdministrationModals.ModalEquipments
          isOpen={modal.isOpen}
          onClose={modal.close}
          current={equipments.current}
          readonly={equipments.readonly}
        />
      );
  }
}
