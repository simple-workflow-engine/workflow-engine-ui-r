import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Typography } from '@mui/material';
import { type FC } from 'react';

import { ReactFlowProvider } from 'reactflow';

import WorkflowEdit from './components/WorkflowEdit';
import WorkflowDefinitionContextProvider from '@/contexts/WorkflowDefinitionContext';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { API, API_NAME } from '@/api/WorkflowDefinitionSingle/api';

interface Props {}

const WorkflowDefinitionEditPage: FC<Props> = () => {
  const params = useParams<{ id: string }>();
  const { getAccessTokenSilently } = useAuth0();

  const { data, isLoading } = useQuery({
    queryKey: [API_NAME, params?.id],
    queryFn: async () => {
      if (params?.id) {
        return API(getAccessTokenSilently, params.id);
      }
      return null;
    },
  });

  return (
    <Box
      sx={{
        height: '80vh',
        padding: 3,
      }}
    >
      {isLoading && <Typography>Loading ...</Typography>}
      {!isLoading && data && (
        <ReactFlowProvider>
          <WorkflowDefinitionContextProvider>
            <WorkflowEdit definition={data} />
          </WorkflowDefinitionContextProvider>
        </ReactFlowProvider>
      )}
    </Box>
  );
};

export default withAuthenticationRequired(WorkflowDefinitionEditPage);
