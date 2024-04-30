"use client";
import { PageTitle } from "@/components";
import { SimpleTab } from "@/components/blocks/tabs";
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { Geradas } from "./tabs/geradas/geradas";
import { Reconhecidas } from "./tabs/reconhecidas/reconhecidas";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";
import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";
import { ocurrrenceClassificationService } from "@/services/Ocurrences";
import { ocurrenceTypeService } from "@/services/Ocurrences/ocurrenceTypeService";
import { ocurrenceCharacterizationService } from "@/services/Ocurrences/ocurrenceCharacterizationsService";
import { Encerradas } from "./tabs/encerradas/encerradas";
import { ReceiptLongOutlined } from "@mui/icons-material";
import { COLORS } from "@/utils";

export default function Ocorrencias() {
  const isMobile = useMediaQuery("(max-width:768px)");

  const [activeTab, setActiveTab] = useState<number | undefined>();

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
      label: "Geradas",
      icon: <ReceiptLongOutlined sx={{ color: COLORS.primary["500"] }} />,
    },
    {
      label: "Reconhecidas",
      icon: <ReceiptLongOutlined sx={{ color: COLORS.primary["500"] }} />,
    },
    {
      label: "Encerradas",
      icon: <ReceiptLongOutlined sx={{ color: COLORS.primary["500"] }} />,
    },
  ];

  return (
    <div className="p-4 lg:p-8">
      <PageTitle
        title="Ocorrências"
        subtitle="Veja aqui todas as permissões, empresas e equipamentos cadastrados"
      />
      <SimpleTab
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileView
      />
      {activeTab == 0 && (
        <Geradas
          isMobile={isMobile}
          classifications={classifications}
          characterizations={characterizations}
          types={types}
        />
      )}
      {activeTab == 1 && (
        <Encerradas
          isMobile={isMobile}
          classifications={classifications}
          characterizations={characterizations}
          types={types}
        />
      )}
      {activeTab == 2 && (
        <Reconhecidas
          isMobile={isMobile}
          classifications={classifications}
          characterizations={characterizations}
          types={types}
        />
      )}
    </div>
  );
}
