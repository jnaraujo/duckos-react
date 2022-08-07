import { createContext, useState, ReactNode } from "react";
import { ApplicationType, App } from "../types/ApplicationType";

const applicationContext = createContext<ApplicationType>({
  apps: [],
  addApp: (app: App) => {},
  removeApp: (id: string) => {},
});

function randomFixedInteger(length: number) {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
}

const applicationProvider = ({ children }: { children: ReactNode }) => {
  const [apps, setApps] = useState<App[]>([]);

  const addApp = (app: App) => {
    if (!apps.find((app) => app.id === app.id)) {
      setApps([...apps, app]);
    } else {
      app.id = app.id + "-" + randomFixedInteger(10);
      setApps([...apps, app]);
    }
  };

  const removeApp = (id: string) => {
    setApps((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <applicationContext.Provider
      value={{
        apps,
        addApp,
        removeApp,
      }}
    >
      {children}
    </applicationContext.Provider>
  );
};

export { applicationContext };

export default applicationProvider;
