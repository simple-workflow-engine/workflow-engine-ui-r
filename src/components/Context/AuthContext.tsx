import type { FC, ReactNode } from 'react';
import { createContext, useState } from 'react';

export const AuthContext = createContext<{
  token?: string;
  isAuthenticated: boolean;
  changeAuthData: (value: { token?: string; isAuthenticated: boolean }) => void;
}>({
  isAuthenticated: false,
  changeAuthData: () => {},
});

interface Props {
  children: ReactNode;
}

const AuthContextProvider: FC<Props> = ({ children }) => {
  const [authData, setAuthData] = useState<{ token?: string; isAuthenticated: boolean }>({
    isAuthenticated: false,
  });

  const changeAuthData = (value: typeof authData) => {
    setAuthData(() => value);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authData,
        changeAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
