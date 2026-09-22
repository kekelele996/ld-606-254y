export interface Vessel {
  id: number;
  vessel_name: string;
  imo_no: string;
  carrier: string;
  length_m: number;
  draft_m: number;
  eta: string;
  etd: string;
  status: string;
}
