import React, { useState } from 'react';
import AuthContext from './authContext';

const AuthState = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');
  return <AuthContext.Provider value={
    { isAuthenticated, role, setRole }
  } />;
};