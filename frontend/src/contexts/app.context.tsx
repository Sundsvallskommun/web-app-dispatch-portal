import { createContext, useContext, useState, ReactNode } from 'react';

export interface AppContextInterface {
  isCookieConsentOpen: boolean;
  setIsCookieConsentOpen: (isOpen: boolean) => void;
  setDefaults: () => void;
}

const AppContext = createContext<AppContextInterface>({
  isCookieConsentOpen: false,
  setIsCookieConsentOpen: () => ({}),
  setDefaults: () => ({}),
});

export function AppWrapper({ children }: { children: ReactNode }) {
  const contextDefaults = {
    isCookieConsentOpen: true,
  };
  const setDefaults = () => {
    setIsCookieConsentOpen(contextDefaults.isCookieConsentOpen);
  };
  const [isCookieConsentOpen, setIsCookieConsentOpen] = useState(true);

  return (
    <AppContext.Provider
      value={{
        isCookieConsentOpen,
        setIsCookieConsentOpen: (isOpen: boolean) => setIsCookieConsentOpen(isOpen),

        setDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
