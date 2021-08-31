export type RDemandType = {
  recruitment: Recruitment;
  demand: Demand;
};

export interface Recruitment {
  id: string;
  shared_profile_ids: string[];
}

export interface Demand {
  id: string;
  name: string;
  startDate: string;
  quantity: number;
  expense: string;
  status: string;
  enabled: boolean;
  profile_name: string;
  request_id: number;
  user_first_name: string;
  user_last_name: string;
}
