import { useServiceOperations } from "@/contexts/ServiceOperationsConfigProvider";
import { ServicosOperacionaisConfigModals } from "../Overlay";

export function ModalTabs({ tab }: { tab: number }) {
  const { modal, contexts, taskGroups } = useServiceOperations();

  if (!modal.isOpen) return null;
 
  if(tab === 0) 
    return (
    <ServicosOperacionaisConfigModals.ModalContext
      isOpen={modal.isOpen}
      onClose={modal.close}
      current={contexts.current}
      readonly={contexts.readonly}
    />
  )
  if(tab === 1)
    return (
    <ServicosOperacionaisConfigModals.ModalTaskGroup
      isOpen={modal.isOpen}
      onClose={modal.close}
      current={taskGroups.current}
      readonly={taskGroups.readonly}
    />
  ) 
}