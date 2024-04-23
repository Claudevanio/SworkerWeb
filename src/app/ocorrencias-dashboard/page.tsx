"use client";
import { PageTitle } from "@/components";
import {
  AccessTimeOutlined,
  ArticleOutlined,
  CheckOutlined,
  CollectionsBookmarkOutlined,
  ManageHistoryOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import CardOcurrence from "./components/cardOcurrence";
import Classification from "./components/classification";
import { useEffect, useState } from "react";
import {
  ocurrenceCharacterizationService,
  ocurrenceService,
  ocurrrenceClassificationService,
} from "@/services/Ocurrences";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { IOcurrence } from "@/types/models/Ocurrences/IOcurrence";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IFilterOcurrences } from "@/types/models/Ocurrences/IFilterOcurrences";
import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";

dayjs.locale("pt-br");

export default function OcorrenciasDashboard() {
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

  const [ocurrences, setOcurrences] = useState<IOcurrence[]>([]);
  const [classifications, setClassifications] = useState<
    IOcurrenceClassification[]
  >([]);
  const [characterizations, setCharacterizations] = useState<
    IOcurrenceCharacterization[]
  >([]);

  const getOcurrences = async () => {
    const ocurrencesResponse = await ocurrenceService.listOcurrenceAsync(
      null,
      null,
      null,
      {
        registerDateStart: today.toISOString(),
        registerDateEnd: plusGapDaysAfter.toISOString(),
      } as IFilterOcurrences
    );

    setOcurrences(ocurrencesResponse.items);
  };

  const getClassifications = async () => {
    const classificationResponse =
      await ocurrrenceClassificationService.getClassifications();

    setClassifications(classificationResponse);
  };

  const getCharacterizations = async () => {
    const characterizationResponse =
      await ocurrenceCharacterizationService.getCharacterizations();

    setCharacterizations(characterizationResponse);
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
    getClassifications();
    getCharacterizations();
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
      <Stack flexDirection="row" mt={2} justifyContent="space-between">
        <CardOcurrence
          Icon={ReceiptLongOutlined}
          percentage={percentGenerate}
          days={GAP_DAYS}
          dayStart={today.format("DD")}
          dayEnd={plusGapDaysAfter.format("DD")}
          month={today.format("MMM")}
          number={countGenerate}
          statusOcurrence={"Geradas"}
          width="32%"
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
          width="32%"
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
          width="32%"
        />
      </Stack>
      {classifications.map((classification, index) => {
        const ocurrenceFiltred = ocurrences.filter(
          (occurrence) => occurrence.occurrenceTypeId == classification.type?.id
        );

        const characterizationsFiltred = characterizations.filter(
          (characterization) =>
            characterization.type?.id == classification.type?.id
        );

        const arrayByCharacterization = [];

        characterizationsFiltred.forEach((characterization) => {
          const obj = {
            icon: AccessTimeOutlined,
            number: ocurrenceFiltred.filter(
              (item) => item.characterization.id == characterization.id
            ).length,
            description: characterization.description,
          };

          arrayByCharacterization.push(obj);
        });

        return (
          <div key={index}>
            <Typography mt={4} fontWeight={700} fontSize="1.7rem">
              {classification.description}
            </Typography>
            <Classification classificationCards={arrayByCharacterization} />
          </div>
        );
      })}
    </div>
  );
}
