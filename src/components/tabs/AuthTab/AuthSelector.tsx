import { AuthContext } from "contexts/AuthContext";
import { AuthMode } from "models/types";
import React, { useContext } from "react";

const AuthSelector = () => {
  const { selectedAuthMode, setSelectedAuthMode, availableAuthModes } =
    useContext(AuthContext);

  const availableAuthModesList = Object.entries(availableAuthModes).filter(
    ([, available]) => available
  );

  return (
    <div>
      <h1>Select Auth Mode</h1>
      {availableAuthModesList.length > 0 ? (
        <select
          name="authMode"
          id="authMode"
          value={selectedAuthMode}
          onChange={(e) => setSelectedAuthMode(e.target.value as AuthMode)}
        >
          {availableAuthModesList.map(([authMode]) => (
            <option key={authMode} value={authMode}>
              {authMode}
            </option>
          ))}
        </select>
      ) : (
        <p>No auth modes available</p>
      )}
    </div>
  );
};

export default AuthSelector;
