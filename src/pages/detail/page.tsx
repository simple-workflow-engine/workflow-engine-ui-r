import { API, API_NAME } from '@/api/WorkflowDefinitionDetail/api';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { type FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

import StartNowDialog from './components/StartNowDialog';

interface Props {}

const WorkflowDetailPage: FC<Props> = () => {
  const { getAccessTokenSilently } = useAuth0();
  const params = useParams<{ id: string }>();

  const { data, isLoading, refetch } = useQuery({
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
        padding: { sm: 3, xs: 1 },
      }}
    >
      {isLoading && <Typography>Loading...</Typography>}
      {!isLoading && data && (
        <Stack
          justifyContent={'flex-start'}
          alignItems={'flex-start'}
          rowGap={2}
          sx={{
            width: '100%',
          }}
        >
          <Typography variant="h4">Workflow Definition</Typography>
          <Card
            elevation={0}
            sx={{
              border: (theme) => `1px solid ${theme.palette.grey['A200']}`,
              width: '100%',
            }}
          >
            <CardHeader
              title={<Typography variant="h4">{data?.name}</Typography>}
              action={
                <Chip color={data?.status === 'active' ? 'success' : 'error'} label={data?.status?.toUpperCase()} />
              }
            />
            <CardContent>
              <Stack rowGap={2}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: (theme) => theme.palette.grey['A700'],
                  }}
                >
                  {data?.description}
                </Typography>
                <Stack
                  direction={{ sm: 'row', xs: 'column' }}
                  columnGap={2}
                  rowGap={2}
                  justifyContent={'space-between'}
                  alignItems={{ sm: 'center', xs: 'flex-start' }}
                >
                  <Typography>Last Updated: {format(new Date(data?.updatedAt), 'dd MMM yyyy, hh:mm aa')}</Typography>
                  <Typography>Created: {format(new Date(data?.createdAt), 'dd MMM yyyy, hh:mm aa')}</Typography>
                </Stack>
              </Stack>
            </CardContent>
            <CardActions
              sx={{
                columnGap: 2,
              }}
            >
              <Link to={`/edit/${data._id}`}>
                <Button variant="outlined" startIcon={<EditIcon />}>
                  Edit
                </Button>
              </Link>
              <StartNowDialog refetch={refetch} workflowDefinitionId={data._id} />
            </CardActions>
          </Card>
          <Typography variant="h4">Workflow Runtimes</Typography>
          {data.runtimes.map((runtime) => (
            <Link style={{ width: '100%' }} key={runtime._id} to={`/runtime/${runtime._id}`}>
              <Card
                elevation={0}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.grey['A200']}`,
                  width: '100%',
                  ':hover': {
                    backgroundColor: (theme) => theme.palette.grey['100'],
                  },
                }}
              >
                <CardHeader
                  title={<Typography>{runtime._id}</Typography>}
                  action={
                    <Chip
                      color={runtime.workflowStatus === 'completed' ? 'success' : undefined}
                      label={runtime.workflowStatus.toUpperCase()}
                    />
                  }
                />
                <CardContent>
                  <Stack
                    direction={{ sm: 'row', xs: 'column' }}
                    columnGap={2}
                    rowGap={2}
                    justifyContent={'space-between'}
                    alignItems={{ sm: 'center', xs: 'flex-start' }}
                  >
                    <Typography>
                      Last Updated: {format(new Date(runtime?.updatedAt), 'dd MMM yyyy, hh:mm aa')}
                    </Typography>
                    <Typography>Created: {format(new Date(runtime?.createdAt), 'dd MMM yyyy, hh:mm aa')}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          ))}
          {data.runtimes?.length < 1 ? (
            <Typography
              sx={{
                textAlign: 'center',
                width: '100%',
              }}
            >
              No runtime found!
            </Typography>
          ) : null}
        </Stack>
      )}
    </Box>
  );
};

export default withAuthenticationRequired(WorkflowDetailPage);
