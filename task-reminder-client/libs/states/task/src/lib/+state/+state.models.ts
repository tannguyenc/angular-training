import { ITaskResponse } from './../../../../../datas/task-reminder';
/**
 * Interface for the 'State' data
 */
export interface StateEntity {
  id: string | number; // Primary ID
  name: string;
  allTaskResponse: ITaskResponse[];
}
