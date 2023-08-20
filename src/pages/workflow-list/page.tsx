import { httpClient } from '@/lib/http/httpClient';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';

interface Props {}

const WorkflowListPage: FC<Props> = () => {
  const { data } = useQuery({
    queryFn: () => httpClient.get('/definition').then((res) => res.data.data),
    queryKey: ['workflow-definitions'],
  });

  return (
    <Box
      sx={{
        height: '80vh',
        padding: 3,
      }}
    >
      <pre>{JSON.stringify(data, undefined, 3)}</pre>
    </Box>
  );
};

export default withAuthenticationRequired(WorkflowListPage);
