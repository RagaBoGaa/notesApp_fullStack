export interface Profile {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  permissions?: {
    display_name: string;
    id: number;
    name: string;
  }[];
}

export interface ProfileContentType {
  id: number;
  image: string;
  name: string;
  parent_id: number | null;
  progreess: number;
}
