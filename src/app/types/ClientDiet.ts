import {Client} from './Client';
import {Diet} from './Diet';

export interface ClientDiet {

  id: number;
  diet: Diet;
  client: Client;
  maintainKcal: number;
  dailyKcalTarget: number;
  dailyProteinTarget: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt: string;
}
