export interface IAuthenticate {
  id: string;
  email: string;
  fullName: string;
  token: string;
  photoUrl: string;
}

export interface IUserGoogle {
  code: string;
  email: string;
  name: string;
  picture: string;
}
