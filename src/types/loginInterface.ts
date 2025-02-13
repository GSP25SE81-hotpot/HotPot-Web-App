export interface LoginInfo {
  tokenModel: TokenModel;
  id: string;
  username: string;
  password: null;
  status: string;
  role: string;
}

export interface TokenModel {
  accessToken: string;
  refreshToken: string;
}
