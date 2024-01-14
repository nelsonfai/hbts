import { createContext, useContext, useState } from 'react';

const swipeableContext = createContext();

export const SwipeableProvider = ({ children }) => {
  const [openRowId, setOpenRowId] = useState(null);

  return (
    <swipeableContext.Provider value={{ openRowId, setOpenRowId }}>
      {children}
    </swipeableContext.Provider>
  );
};

export const useSwipeable = () => {
  return useContext(swipeableContext);
};
