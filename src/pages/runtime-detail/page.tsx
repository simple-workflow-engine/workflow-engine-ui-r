import { API, API_NAME } from '@/api/WorkflowRuntimeDetail/api';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Refresh } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import type { FC } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Props {}

const RuntimeDetailPage: FC<Props> = () => {
  const { getAccessTokenSilently } = useAuth0();
  const params = useParams<{ id: string }>();

  const { enqueueSnackbar } = useSnackbar();

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
              <CardContent>
                <Stack rowGap={2}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: (theme) => theme.palette.grey['A700'],
                    }}
                  >
                    {data?.definition?.description}
                  </Typography>
                  <Stack
                    direction={{ sm: 'row', xs: 'column' }}
                    columnGap={2}
                    rowGap={2}
                    justifyContent={'space-between'}
                    alignItems={{ sm: 'center', xs: 'flex-start' }}
                  >
                    <Typography>
                      Last Updated: {format(new Date(data?.definition?.updatedAt), 'dd MMM yyyy, hh:mm aa')}
                    </Typography>
                    <Typography>
                      Created: {format(new Date(data?.definition?.createdAt), 'dd MMM yyyy, hh:mm aa')}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
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
            <Typography variant="h5">Runtime</Typography>
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
              <CardHeader
                title={<Typography>{data._id}</Typography>}
                action={
                  <Chip
                    label={data.workflowStatus.toUpperCase()}
                    color={data.workflowStatus === 'completed' ? 'success' : undefined}
                  />
                }
              />
              <CardContent>
                <Stack rowGap={2}>
                  <Typography>Last Updated: {format(new Date(data?.updatedAt), 'dd MMM yyyy, hh:mm aa')}</Typography>
                  <Typography>Created: {format(new Date(data?.createdAt), 'dd MMM yyyy, hh:mm aa')}</Typography>
                </Stack>
              </CardContent>
            </Card>
            <Typography variant="h5">Tasks</Typography>
            <Stack
              direction={'row'}
              sx={{
                width: '100%',
                flexWrap: 'wrap',
                border: (theme) => `1px solid ${theme.palette.grey['A200']}`,
                padding: 2,
              }}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
              rowGap={2}
              columnGap={2}
            >
              {data.tasks.map((task) => (
                <Card
                  elevation={0}
                  key={task.id}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.grey['100']}`,
                  }}
                >
                  <CardHeader
                    title={task.name}
                    action={<Chip color="primary" size="small" label={task.type.toUpperCase()} />}
                  />
                  <CardContent>
                    <Stack justifyContent={'flex-start'} alignItems={'flex-start'} rowGap={4}>
                      <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} columnGap={1}>
                        <Typography>Status:</Typography>
                        <Chip
                          size="small"
                          label={task.status.toUpperCase()}
                          color={task.status === 'completed' ? 'success' : undefined}
                        />
                      </Stack>
                      {data?.workflowResults?.[task.name] && (
                        <Tooltip title={JSON.stringify(data?.workflowResults?.[task.name], undefined, 4)}>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              navigator.clipboard
                                .writeText(JSON.stringify(data?.workflowResults?.[task.name], undefined, 4))
                                .then(() => {
                                  enqueueSnackbar('Result copied to Clipboard', {
                                    variant: 'success',
                                    autoHideDuration: 2 * 1000,
                                  });
                                })
                                .catch();
                            }}
                          >
                            Copy Result
                          </Button>
                        </Tooltip>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Typography variant="h5">Logs</Typography>
            {/* <Stack
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
                    }}
                  >
                    {taskName}
                  </Typography>
                  <Typography
                    sx={{
                      color: (theme) => theme.palette.grey['800'],
                      width: '100%',
                      flex: 1,
                    }}
                  >
                    {log}
                  </Typography>
                </Stack>
              ))}
            </Stack> */}
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default withAuthenticationRequired(RuntimeDetailPage);
