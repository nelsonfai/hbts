import { createContext, useContext, useState } from 'react';
const SummaryContext = createContext();
export const SummaryProvider= ({ children }) => {
  const [summary, setSummary] = useState(null);

  return (
    <SummaryContext.Provider value={{ summary, setSummary }}>
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummary = () => {
  return useContext(SummaryContext);
};

