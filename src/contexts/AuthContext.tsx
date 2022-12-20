import { AuthMode } from "models/types";
import { createContext } from "react";

type AuthContextType = {
  selectedAuthMode: AuthMode | undefined;
  setSelectedAuthMode: (authMode: AuthMode) => void;
  availableAuthModes: Record<AuthMode, boolean>;
  setAvailableAuthModes: (authModes: Record<AuthMode, boolean>) => void;
};

export const AuthContext = createContext<AuthContextType>({
  selectedAuthMode: undefined,
  setSelectedAuthMode: () => {},
  availableAuthModes: {
    ethereum: false,
    apiKey: false,
  },
  setAvailableAuthModes: () => {},
});
