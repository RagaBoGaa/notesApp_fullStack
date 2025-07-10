// export type LoginFormResponse = {
//   status: boolean;
//   data: {
//     id: number;
//     name: string;
//     type: string;
//     email: string;
//     phone: string;
//     image: string;
//     birth_date: null;
//     address: null;
//     address_location: null;
//     about: null;
//     total_order: number;
//     device_token: null;
//     created_at: string;
//   };
//   message: string;
//   access_token: string;
// };

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
    type: string;
    email: string;
    phone?: string;
    image?: string;
    token: string;
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
