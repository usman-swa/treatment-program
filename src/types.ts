// src/types.ts
export type Activity = {
  weekday: string;
  title: string;
  completed: boolean;
};

export type TreatmentProgram = {
  week36: Activity[];
  week37: Activity[];
  week38: Activity[];
};
