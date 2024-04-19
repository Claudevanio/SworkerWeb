"use client";
import { PageTitle } from "@/components";
import { SimpleTab } from "@/components/blocks/tabs";
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";
import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";
import { ocurrrenceClassificationService } from "@/services/Ocurrences";
import { ocurrenceTypeService } from "@/services/Ocurrences/ocurrenceTypeService";
import { ocurrenceCharacterizationService } from "@/services/Ocurrences/ocurrenceCharacterizationsService";
import { Classificacao } from "./tabs/classificacao/classificacao";

export default function OcorrenciasConfig() {
  const isMobile = useMediaQuery("(max-width:768px)");

  const [activeTab, setActiveTab] = useState<number | undefined>();

  const [openModalAddClassification, setOpenModalAddClassification] =
    useState(false);

  const [classifications, setClassifications] = useState<
    IOcurrenceClassification[]
  >([]);

  const [types, setTypes] = useState<IOcurrenceType[]>([]);

  const [characterizations, setCharacterizations] = useState<
    IOcurrenceCharacterization[]
  >([]);

  const getClassifications = async () => {
    const result = await ocurrrenceClassificationService.getClassifications();

    setClassifications(result);
  };

  const getTypes = async () => {
    const result = await ocurrenceTypeService.getTypes();

    setTypes(result.data.data);
  };

  const getCharacterizations = async () => {
    const result =
      await ocurrenceCharacterizationService.getCharacterizations();

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
      label: "Tipo",
    },
    {
      label: "Categorização",
    },
    {
      label: "Classificação",
    },
  ];

  return (
    <div className="p-4 lg:p-8">
      <PageTitle
        title="Configurações"
        subtitle="Veja aqui todas as permissões, empresas e equipamentos cadastrados"
        button={{
          label:
            activeTab == 0
              ? "Adicionar tipo"
              : activeTab == 1
              ? "Adicionar categoria"
              : "Adicionar classificação",
          onClick: () => {
            if(activeTab == 2){
              setOpenModalAddClassification(true)
            }
          },
          isAdd: true,
          hideOnMobile: true,
        }}
      />
      <SimpleTab
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileView
      />
      {activeTab == 0 && <></>}
      {activeTab == 1 && <></>}
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
