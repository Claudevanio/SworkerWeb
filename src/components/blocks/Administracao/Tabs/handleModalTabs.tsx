import { useAdministrator } from '@/contexts/AdministrationProvider'
import { AdministrationModals } from '../Overlay'

export function ModalTabs({
  tab,
  subtab
} :{
  tab: number,
  subtab: number
}){
  const {
    modal,
    companies,
    permissions,
    companyUnities,
    sectors,
    professionals,
    equipments
  } = useAdministrator()

  if(!modal.isOpen)
    return null;

  if(tab === 0 )
    return <AdministrationModals.ModalPermissions
      isOpen={modal.isOpen}
      onClose={modal.close}
      current={permissions.current} 
    />
 
  switch(subtab){
    case 0:
      return <AdministrationModals.ModalCompany
        isOpen={modal.isOpen}
        onClose={modal.close}
        current={companies.current}
        readonly={companies.readonly}
      />
    case 1:
      return <AdministrationModals.ModalCompanyUnity
        isOpen={modal.isOpen}
        onClose={modal.close}
        current={companyUnities.current}
        readonly={companyUnities.readonly}
      />
    case 2:
      return <AdministrationModals.ModalSector
        isOpen={modal.isOpen}
        onClose={modal.close}
        current={sectors.current}
        readonly={sectors.readonly}
      />
    case 3:
      return <AdministrationModals.ModalProfessional
        isOpen={modal.isOpen}
        onClose={modal.close}
        current={professionals.current}
        readonly={professionals.readonly}
      />  
    case 4:
      return <AdministrationModals.ModalEquipments
        isOpen={modal.isOpen}
        onClose={modal.close}
        current={companyUnities.current}
        readonly={companyUnities.readonly}
      />
  } 
  
}