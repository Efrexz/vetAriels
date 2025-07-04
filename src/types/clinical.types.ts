export interface PhysiologicalConstants {
  temperature: string;
  heartRate: string;
  weight: string;
  oxygenSaturation: string;
}

export interface ClinicalRecord {
  id: number;
  dateTime: string;
  reason: string;
  anamnesis: string;
  physiologicalConstants: PhysiologicalConstants;
  clinicalExam: string;
  createdBy: string;
}

export interface RecordFormData {
  dateTime: string;
  reason: string;
  anamnesis: string;
  physiologicalConstants: PhysiologicalConstants;
  clinicalExam: string;
}