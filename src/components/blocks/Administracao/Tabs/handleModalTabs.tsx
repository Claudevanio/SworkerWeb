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
  } 
  
}