import { createContext } from 'react';

export interface AuthContextDataType {
  isAuthenticated: boolean,
  role: string,
  setRole: (role: string) => void,
}

const AuthContextDefaultValue = {
  isAuthenticated: false,
  role: '',
  setRole: () => null
};


const AuthContext = createContext<AuthContextDataType>(AuthContextDefaultValue);

export default AuthContext;