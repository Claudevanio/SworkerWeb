import { IOcurrence, ListOccurrenceProfessionalModal } from "./IOcurrence";
import { IOcurrenceCharacterization } from "./IOcurrenceCharacterization";
import { IOcurrenceClassification } from "./IOcurrenceClassification";

export interface IOcurrenceRecognize {
  id: number;
  occurrenceId: number;
  occurrence: IOcurrence;
  supervisorId: number;
  supervisor: ListOccurrenceProfessionalModal;
  professionalId: number;
  professional: ListOccurrenceProfessionalModal;
  classificationId: number;
  classification: IOcurrenceClassification;
  characterizationId: number;
  characterization: IOcurrenceCharacterization;
  registerDate: string;
  acknowledgeDate: string;
  closeDate: string;
  local: string;
  description: string;
  observation: string;
  daysWorkedAfterDayOff: number;
  absenceDays: number;
  recognized: boolean;
  closed: boolean;
}