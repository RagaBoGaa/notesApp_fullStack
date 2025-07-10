export interface UserData {
  id: number;
  name: string;
  type: string;
  email: string;
  phone: string;
  image: string;
  birth_date: string | null;
  address: string | null;
  address_location: string | null;
  about: string | null;
  total_order: number;
  device_token: string | null;
  created_at: string;
}

export interface LoginResponse {
  status: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    token: string;
    type?: string;
    phone?: string;
    image?: string;
  };
}

export type LoginForm = {
  email: string;
  password: string;
};

export type RegisterForm = {
  name: string;
  email: string;
  password: string;
};
