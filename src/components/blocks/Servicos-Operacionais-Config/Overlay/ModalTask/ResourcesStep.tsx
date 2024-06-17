import { Input } from '@/components/ui';
import { AutoComplete } from '@/components/ui/autocomplete';
import { equipmentClassificationService, equipmentService } from '@/services/Administrator/equipmentService';
import { IEquipment, IEquipmentClassification } from '@/types';
import { ITask } from '@/types/models/ServiceOrder/ITask';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export function ResourcesStep({
  currentEquipment,
  setCurrentEquipment,
  tasksResources
}: {
  currentEquipment: {
    id: string;
    taskId: string;
    classification: string;
    description: string;
  };
  setCurrentEquipment: (equip: { id: string; taskId: string; classification: string; description: string }) => void;
  tasksResources: any;
}) {
  const [searchEquipment, setSearchEquipment] = React.useState(currentEquipment.description);

  return (
    <div className="flex flex-col border-[1px] rounded-lg p-1 border-base-4 md:border-none md:flex-row gap-4 md:gap-6">
      <AutoComplete
        label="Recursos"
        inputValue={searchEquipment}
        inputOnChange={value => setSearchEquipment(value)}
        options={(tasksResources.data ?? []).map((t: IEquipmentClassification) => ({ name: t.description, value: t.id }))}
        onSelect={(value: { name: string; value: string }) => {
          if (!value) return;

          const id = value.value;
          const resource = tasksResources.data?.find(r => r.id === id);
          const handledResource = {
            id: resource?.id,
            taskId: resource?.id,
            classification: resource?.type?.description,
            description: resource?.description
          };
          if (handledResource) {
            setCurrentEquipment(handledResource);
          }
        }}
      />
      <Input disabled label="Classificação" value={currentEquipment.classification} />
    </div>
  );
}
