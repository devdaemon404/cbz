import responseBaseV2 from './response-base-v2';

export type LoginResponseType = {
  data: {
    columnCount: number;
    options: string[];
  };
} & responseBaseV2;
