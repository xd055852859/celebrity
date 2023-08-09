import { User } from "./User";

export interface ResultProps {
  msg: string;
  data: any;
  status: number;
  pageNum?: number;
  totalNum?: number;
  total?: number;
}
export interface Celebrity {
  _key: string;
  name: string;
  cover: string;
  description: string;
  url: string;
}
