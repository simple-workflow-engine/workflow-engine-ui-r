import { API, API_NAME } from '@/api/WorkflowDefinitionDetail/api';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';

interface Props {}

const WorkflowDetailPage: FC<Props> = () => {
  const { getAccessTokenSilently } = useAuth0();
  const params = useParams<{ id: string }>();

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
        padding: 3,
      }}
    >
      {isLoading && <Typography>Loading...</Typography>}
      {!isLoading && data && <pre>{JSON.stringify(data, undefined, 4)}</pre>}
    </Box>
  );
};

export default withAuthenticationRequired(WorkflowDetailPage);
