import { API, API_NAME } from '@/api/WorkflowRuntimeDetail/api';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Refresh } from '@mui/icons-material';
import { Box, Card, CardContent, CardHeader, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import type { FC } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Props {}

const RuntimeDetailPage: FC<Props> = () => {
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

  const handleRefresh = () => {
    refetch();
  };

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
          rowGap={4}
          sx={{
            width: '100%',
          }}
        >
          <Typography variant="h4">Workflow Definition</Typography>
          <Link
            style={{
              width: '100%',
            }}
            to={`/workflows/${data.definition._id}`}
          >
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
                title={<Typography variant="h4">{data.definition.name}</Typography>}
                action={
                  <Chip
                    color={data.definition.status === 'active' ? 'success' : 'error'}
                    label={data.definition?.status?.toUpperCase()}
                  />
                }
              />
            </Card>
          </Link>
          <Stack
            direction={{ sm: 'row', xs: 'column' }}
            justifyContent={'space-between'}
            alignItems={{ sm: 'center', xs: 'flex-start' }}
            columnGap={1}
            rowGap={2}
            sx={{
              width: '100%',
            }}
          >
            <Typography variant="h5">Runtime {data._id}</Typography>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack
            sx={{
              width: '100%',
            }}
            rowGap={2}
          >
            <Card
              elevation={0}
              sx={{
                border: (theme) => `1px solid ${theme.palette.grey['A200']}`,
                width: '100%',
              }}
            >
              <CardHeader title={<Typography>{data._id}</Typography>} />
              <CardContent>
                <Stack rowGap={2}>
                  <Typography>Last Updated: {format(new Date(data?.updatedAt), 'dd MMM yyyy, hh:mm aa')}</Typography>
                  <Typography>Created: {format(new Date(data?.createdAt), 'dd MMM yyyy, hh:mm aa')}</Typography>
                </Stack>
              </CardContent>
            </Card>
            <Typography variant="h5">Logs</Typography>
            <Stack
              sx={{
                width: '100%',
                overflowX: 'auto',
                overflowY: 'auto',
                maxHeight: '500px',
                border: (theme) => `1px solid ${theme.palette.grey['A200']}`,
              }}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
            >
              {data.splittedLogs.map(({ datetime, log, taskName }, index) => (
                <Stack
                  key={datetime}
                  direction={'row'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  columnGap={2}
                  sx={{
                    width: '100%',
                    ...(index < data.splittedLogs.length - 1 && {
                      borderBottom: (theme) => `1px solid ${theme.palette.grey['200']}`,
                    }),
                    paddingY: 2,
                    paddingX: 1,
                  }}
                >
                  <Tooltip title={format(new Date(datetime), 'dd MMM yyyy, hh:mm aa')}>
                    <Chip label={datetime} />
                  </Tooltip>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      width: '100%',
                    }}
                  >
                    {taskName}
                  </Typography>
                  <Typography
                    sx={{
                      color: (theme) => theme.palette.grey['800'],
                      width: '100%',
                    }}
                  >
                    {log}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default withAuthenticationRequired(RuntimeDetailPage);
