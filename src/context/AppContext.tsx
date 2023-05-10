import { createContext } from 'react'


export interface GeneratorState {
  progress: number;
  taskId: string;
  creation: any;
  generating: boolean;
}

interface AppContextType {
  isSignedIn: boolean;
  setIsSignedIn: (signedIn: boolean) => void;
  isNewUser: boolean;
  setIsNewUser: (newUser: boolean) => void;
  username: string | null;
  setUsername: (username: string) => void;
  generators: Record<string, GeneratorState>;
  setGenerators: (updater: (prevGenerators: Record<string, GeneratorState>) => Record<string, GeneratorState>) => void;
}

const AppContext = createContext<AppContextType>({
  isSignedIn: false,
  setIsSignedIn: () => {},
  isNewUser: false,
  setIsNewUser: () => {},
  username: null,
  setUsername: () => {},
  generators: {},
  setGenerators: () => {},
});


export default AppContext;
