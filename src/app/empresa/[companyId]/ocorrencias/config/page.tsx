'use client';
import { PageTitle } from '@/components';
import { SimpleTab } from '@/components/blocks/tabs';
import { useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { IOcurrenceClassification } from '@/types/models/Ocurrences/IOcurrenceClassification';
import { IOcurrenceType } from '@/types/models/Ocurrences/IOcurrenceType';
import { IOcurrenceCharacterization } from '@/types/models/Ocurrences/IOcurrenceCharacterization';
import { ocurrrenceClassificationService } from '@/services/Ocurrences';
import { ocurrenceTypeService } from '@/services/Ocurrences/ocurrenceTypeService';
import { ocurrenceCharacterizationService } from '@/services/Ocurrences/ocurrenceCharacterizationsService';
import { Classificacao } from './tabs/classificacao/classificacao';
import { Categorizacao } from './tabs/categorizacao/categorizacao';
import { Tipo } from './tabs/tipo/tipo';
import { ReceiptLongOutlined } from '@mui/icons-material';
import { COLORS } from '@/utils';

export default function OcorrenciasConfig() {
  const isMobile = useMediaQuery('(max-width:768px)');

  const [activeTab, setActiveTab] = useState<number | undefined>();

  const [openModalAddType, setOpenModalAddType] = useState(false);

  const [openModalAddClassification, setOpenModalAddClassification] = useState(false);

  const [openModalAddCharacterization, setOpenModalAddCharacterization] = useState(false);

  const [classifications, setClassifications] = useState<IOcurrenceClassification[]>([]);

  const [types, setTypes] = useState<IOcurrenceType[]>([]);

  const [characterizations, setCharacterizations] = useState<IOcurrenceCharacterization[]>([]);

  const getClassifications = async () => {
    const result = await ocurrrenceClassificationService.getClassifications();

    setClassifications(result);
  };

  const getTypes = async () => {
    const result = await ocurrenceTypeService.getTypes();

    setTypes(result.data.data);
  };

  const getCharacterizations = async () => {
    const result = await ocurrenceCharacterizationService.getCharacterizations();

    setCharacterizations(result);
  };

  useEffect(() => {
    setActiveTab(0);
    getClassifications();
    getTypes();
    getCharacterizations();
  }, []);

  const tabs = [
    {
      label: 'Tipo',
      icon: <ReceiptLongOutlined sx={{ color: COLORS.primary['500'] }} />
    },
    {
      label: 'Categorização',
      icon: <ReceiptLongOutlined sx={{ color: COLORS.primary['500'] }} />
    },
    {
      label: 'Classificação',
      icon: <ReceiptLongOutlined sx={{ color: COLORS.primary['500'] }} />
    }
  ];
  console.info(types)

  return (
    <div className="p-4 lg:p-8">
      <PageTitle
        title="Configurações"
        subtitle="Veja aqui todas as permissões, empresas e equipamentos cadastrados"
        button={{
          label: activeTab == 0 ? 'Adicionar tipo' : activeTab == 1 ? 'Adicionar categoria' : 'Adicionar classificação',
          onClick: () => {
            if (activeTab == 0) {
              setOpenModalAddType(true);
            }
            if (activeTab == 1) {
              setOpenModalAddCharacterization(true);
            }
            if (activeTab == 2) {
              setOpenModalAddClassification(true);
            }
          },
          isAdd: true,
          hideOnMobile: true
        }}
      />
      
      <SimpleTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} mobileView />
      {activeTab == 0 && <Tipo isMobile={isMobile} openModalAdd={openModalAddType} handleCloseModalAdd={() => setOpenModalAddType(false)} />}
      {activeTab == 1 && (
        <Categorizacao
          isMobile={isMobile}
          types={types}
          openModalAdd={openModalAddCharacterization}
          handleCloseModalAdd={() => setOpenModalAddCharacterization(false)}
        />
      )}
      {activeTab == 2 && (
        <Classificacao
          isMobile={isMobile}
          characterizations={characterizations}
          types={types}
          openModalAdd={openModalAddClassification}
          handleCloseModalAdd={() => setOpenModalAddClassification(false)}
        />
      )}
    </div>
  );
}
