import { useContext } from 'react';
import { GlobalContextType } from '../../types/task.types';
import { GlobalContext } from './../../contexts/Global/GlobalContext';

const useGlobal = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

export default useGlobal;
