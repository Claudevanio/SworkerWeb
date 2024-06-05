"use client";
import { PageTitle } from "@/components";
import {
  AccessTimeOutlined,
  CheckOutlined,
  CollectionsBookmarkOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import CardOcurrence from "./components/cardOcurrence";
import Classification from "./components/classification";
import { useEffect, useState } from "react";
import {
  ocurrenceCharacterizationService,
  ocurrenceService,
  ocurrenceTypeService,
  ocurrrenceClassificationService,
} from "@/services/Ocurrences";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  IOcurrence,
  ListOccurrenceCharacterizationModel,
} from "@/types/models/Ocurrences/IOcurrence";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IFilterOcurrences } from "@/types/models/Ocurrences/IFilterOcurrences";
import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";
import { IOcurrenceRecognize } from "@/types/models/Ocurrences/IOcurrenceRecognize";

dayjs.locale("pt-br");

export default function OcorrenciasDashboard() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const GAP_DAYS = 360;

  const today = dayjs("01-01-2024");
  const plusGapDaysAfter = today.add(GAP_DAYS, "day");
  const daysBeforeStart = today.add(-GAP_DAYS, "day");

  const [countGenerate, setCountGenerate] = useState(0);
  const [percentGenerate, setPercentGenerate] = useState<string | number>(0);
  const [countRecognize, setCountRecognize] = useState(0);
  const [percentRecognize, setPercentRecognize] = useState<string | number>(0);
  const [countClose, setCountClose] = useState(0);
  const [percentClose, setPercentClose] = useState<string | number>(0);

  const [ocurrences, setOcurrences] = useState<IOcurrenceRecognize[]>([]);
  const [classifications, setClassifications] = useState<
    IOcurrenceClassification[]
  >([]);
  const [types, setTypes] = useState<IOcurrenceType[]>([]);

  const getOcurrences = async () => {
    const ocurrencesResponse =
      await ocurrenceService.getAllRecognizeOcurrenceAsync();

    setOcurrences(ocurrencesResponse);
  };

  const getClassifications = async () => {
    const classificationResponse =
      await ocurrrenceClassificationService.getClassifications();

    setClassifications(classificationResponse);
  };

  const getTypes = async () => {
    const typesResponse = await ocurrenceTypeService.getTypes();

    const ocurrences = await Promise.all(
      typesResponse.data.data.map(async (type) => {
        const ocurrencesResponse = await ocurrrenceClassificationService.getClassificationsByType(
          type.id
        );
        return {
          ...type,
          classifications: ocurrencesResponse,
        };
      }
    )
  ); 
 

    setTypes(ocurrences);
  };

  const gainOrFall = (current, previous) => {
    if (previous === 0) {
      if (current > 0) {
        return 100;
      } else {
        return 0;
      }
    }

    return (((current - previous) / previous) * 100).toFixed(2);
  };

  const getCounts = async () => {
    const generateResponse = await ocurrenceService.getCountOcurrence(
      today.toISOString(),
      plusGapDaysAfter.toISOString()
    );

    const generateBeforeResponse = await ocurrenceService.getCountOcurrence(
      daysBeforeStart.toISOString(),
      today.toISOString()
    );

    const recognizeResponse = await ocurrenceService.getCountOcurrenceRecognize(
      today.toISOString(),
      plusGapDaysAfter.toISOString()
    );

    const recognizeBeforeResponse =
      await ocurrenceService.getCountOcurrenceRecognize(
        daysBeforeStart.toISOString(),
        today.toISOString()
      );

    const closeResponse = await ocurrenceService.getCountOcurrenceClose(
      today.toISOString(),
      plusGapDaysAfter.toISOString()
    );

    const closeBeforeResponse = await ocurrenceService.getCountOcurrenceClose(
      daysBeforeStart.toISOString(),
      today.toISOString()
    );

    const gainOrFallGenerate = gainOrFall(
      generateResponse,
      generateBeforeResponse
    );

    const gainOrFallRecognize = gainOrFall(
      recognizeResponse,
      recognizeBeforeResponse
    );
    const gainOrFallClose = gainOrFall(closeResponse, closeBeforeResponse);

    setCountGenerate(generateResponse);
    setCountRecognize(recognizeResponse);
    setCountClose(closeResponse);
    setPercentGenerate(gainOrFallGenerate);
    setPercentRecognize(gainOrFallRecognize);
    setPercentClose(gainOrFallClose);
  };

  useEffect(() => {
    getCounts();
    getOcurrences(); 
    getTypes();
  }, []);

  return (
    <div className="p-4 lg:p-8">
      <PageTitle
        title="Dashboard"
        subtitle="Veja aqui o status de todas as tarefas"
      />
      <Typography mt={4} fontWeight={700} fontSize="1.7rem">
        Ocorrências
      </Typography>
      <Stack
        flexDirection={isMobile ? "column" : "row"}
        mt={2}
        justifyContent="space-between"
        gap={2}
      >
        <CardOcurrence
          Icon={ReceiptLongOutlined}
          percentage={percentGenerate}
          days={GAP_DAYS}
          dayStart={today.format("DD")}
          dayEnd={plusGapDaysAfter.format("DD")}
          month={today.format("MMM")}
          number={countGenerate}
          statusOcurrence={"Geradas"}
          width={isMobile ? "auto" : "32%"}
        />
        <CardOcurrence
          Icon={CollectionsBookmarkOutlined}
          percentage={percentRecognize}
          days={GAP_DAYS}
          dayStart={today.format("DD")}
          dayEnd={plusGapDaysAfter.format("DD")}
          month={today.format("MMM")}
          number={countRecognize}
          statusOcurrence={"Reconhecidas"}
          width={isMobile ? "auto" : "32%"}
        />
        <CardOcurrence
          Icon={CheckOutlined}
          percentage={percentClose}
          days={GAP_DAYS}
          dayStart={today.format("DD")}
          dayEnd={plusGapDaysAfter.format("DD")}
          month={today.format("MMM")}
          number={countClose}
          statusOcurrence={"Encerradas"}
          width={isMobile ? "auto" : "32%"}
        />
      </Stack> 
      {types.length > 0 &&
        types?.filter((type) => type.classifications.length > 0).map((type, index) => { 
  
          const arrayByClassifications = type.classifications.map(
            (classification: IOcurrenceClassification) => {
              console.log(classification, "Classification");
              return {
                icon: AccessTimeOutlined,
                number:ocurrences.filter((ocurrence) => ocurrence.classificationId === classification.id).length,
                description: classification.description,
              };
            }
          );

          return (
            <div key={index}>
              <Typography mt={4} fontWeight={700} fontSize="1.7rem">
                {type.description}
              </Typography>
              <Classification
                isMobile={isMobile}
                classificationCards={arrayByClassifications}
              />
            </div>
          );
        })}
    </div>
  );
}
