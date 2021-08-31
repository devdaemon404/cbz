import { HttpClient } from '../utils/op-http-client';

export class AuthService {
  constructor(private httpClient: HttpClient) {
  }

  loginV1 = (userName: string, password: string) => {
    const a = 1;
  };
}