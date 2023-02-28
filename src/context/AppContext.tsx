import { createContext } from 'react'


export interface GeneratorState {
  progress: number;
  taskId: string;
  creation: any;
  generating: boolean;
}

// interface AppContextType {
//   isSignedIn: boolean;
//   setIsSignedIn: (signedIn: boolean) => void;
  
//   generators: Record<string, GeneratorState>;
//   setGenerators: (generators: Record<string, GeneratorState>) => void;
// }

interface AppContextType {
  isSignedIn: boolean;
  setIsSignedIn: (signedIn: boolean) => void;

  generators: Record<string, GeneratorState>;
  setGenerators: (updater: (prevGenerators: Record<string, GeneratorState>) => Record<string, GeneratorState>) => void;
}


const AppContext = createContext<AppContextType>({
  isSignedIn: false,
  setIsSignedIn: () => {},
  generators: {},
  setGenerators: () => {},
});


export default AppContext;
