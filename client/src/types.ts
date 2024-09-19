import { ApiCreateActivityPost201Response } from "./api";

export type TreatmentProgram = {
  [week: string]: ApiCreateActivityPost201Response[]; // This allows dynamic access using string keys
}
