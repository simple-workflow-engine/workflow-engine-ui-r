import type { FC, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

const WorkflowDefinitionContext = createContext<{
  config: Record<string, any>;

  setConfig: (config: Record<string, any>) => void;
}>({
  config: {},

  setConfig: () => null,
});

export const useWorkflowDefinitionContext = () => useContext(WorkflowDefinitionContext);

interface Props {
  children: ReactNode;
}

const WorkflowDefinitionContextProvider: FC<Props> = ({ children }) => {
  const [config, setConfig] = useState<Record<string, any>>({});

  const setNewConfig = (config: Record<string, any>) => {
    setConfig(() => config);
  };

  return (
    <WorkflowDefinitionContext.Provider
      value={{
        config,
        setConfig: setNewConfig,
      }}
    >
      {children}
    </WorkflowDefinitionContext.Provider>
  );
};

export default WorkflowDefinitionContextProvider;
