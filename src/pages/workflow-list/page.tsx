import { API, API_NAME } from '@/api/WorkflowDefinitionList/api';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

interface Props {}

const WorkflowListPage: FC<Props> = () => {
  const { getAccessTokenSilently } = useAuth0();

  const { data, isLoading } = useQuery({
    queryFn: async () => API(getAccessTokenSilently),
    queryKey: [API_NAME],
    initialData: [],
  });

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        padding: 3,
      }}
    >
      <Stack rowGap={4}>
        <Stack direction={'row'} justifyContent={'flex-end'} alignItems={'center'}>
          <Link to="/create">
            <Button variant="outlined" endIcon={<AddIcon />}>
              Create
            </Button>
          </Link>
        </Stack>
        {!isLoading && data && (
          <Stack justifyContent={'flex-start'} alignItems={'flex-start'}>
            {data.map((item: any, index: number) => (
              <Typography key={index}>{item.name}</Typography>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default withAuthenticationRequired(WorkflowListPage);
