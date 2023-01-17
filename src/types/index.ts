import { v4 } from 'uuid';

export enum MethodsTypes {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type IUserIdType = string | ReturnType<typeof v4>;

export interface IUser {
  id: IUserIdType;
  username: string;
  age: number;
  hobbies: string[] | [];
}
