
import { Goal, HealthConcern } from './types';

export const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: Goal.WeightLoss, label: 'Weight Loss' },
  { value: Goal.WeightGain, label: 'Weight Gain' },
  { value: Goal.Maintenance, label: 'Weight Maintenance' },
  { value: Goal.Medical, label: 'Address Specific Medical Needs' },
];

export const HEALTH_CONCERN_OPTIONS: { value: HealthConcern; label: string }[] = [
  { value: HealthConcern.Diabetes, label: 'Diabetes' },
  { value: HealthConcern.PreDiabetes, label: 'Pre-diabetes' },
  { value: HealthConcern.HighCholesterol, label: 'High Cholesterol' },
  { value: HealthConcern.Hypertension, label: 'Hypertension' },
  { value: HealthConcern.Anemia, label: 'Anemia (Iron-deficient)' },
  { value: HealthConcern.VitaminD_Deficiency, label: 'Vitamin D Deficiency' },
  { value: HealthConcern.VitaminB12_Deficiency, label: 'Vitamin B12 Deficiency' },
  { value: HealthConcern.PCOS, label: 'PCOS / PCOD' },
];
