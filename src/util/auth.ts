import { IronSession } from "iron-session";
import { AuthMode } from "models/types";

export const getAuthToken = (authMode: AuthMode, session: IronSession) => {
  switch (authMode) {
    case "apiKey":
      return session.apiKeyToken;
    case "ethereum":
      return session.ethereumToken;
    default:
      throw new Error("Invalid auth mode");
  }
};
