export type Activity = {
  weekday: string;
  title: string;
  completed: boolean;
}

export type TreatmentProgram = {
  [week: string]: Activity[]; // This allows dynamic access using string keys
}
