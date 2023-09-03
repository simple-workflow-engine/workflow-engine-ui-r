import { API, API_NAME } from '@/api/WorkflowDefinitionList/api';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, Button, Card, CardContent, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';

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
          <Stack justifyContent={'flex-start'} alignItems={'flex-start'} rowGap={2}>
            {data.map((item) => (
              <Link
                style={{
                  width: '100%',
                }}
                key={item._id}
                to={`/workflows/${item._id}`}
              >
                <Card
                  elevation={1}
                  sx={{
                    width: '100%',
                    ':hover': {
                      backgroundColor: (theme) => theme.palette.grey['100'],
                    },
                  }}
                >
                  <CardContent>
                    <Stack
                      sx={{
                        width: '100%',
                      }}
                      direction={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Typography variant="h5">{item.name}</Typography>
                      <Chip label={item.status.toUpperCase()} color={item.status === 'active' ? 'primary' : 'error'} />
                    </Stack>
                    <Typography
                      variant="body1"
                      sx={{
                        paddingY: 2,
                        width: '100%',
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Stack
                      sx={{
                        width: '100%',
                      }}
                      direction={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Typography component={'time'} dateTime={item.createdAt}>
                        Created at: {format(new Date(item.createdAt), 'dd MMM, yyyy')}
                      </Typography>
                      <Typography component={'time'} dateTime={item.updatedAt}>
                        Updated at: {format(new Date(item.updatedAt), 'dd MMM, yyyy')}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Stack>
        )}
        {isLoading && (
          <Stack justifyContent={'flex-start'} alignItems={'flex-start'} rowGap={2}>
            <Card
              elevation={1}
              sx={{
                width: '100%',
                ':hover': {
                  backgroundColor: (theme) => theme.palette.grey['100'],
                },
              }}
            >
              <CardContent>
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton animation="wave" variant="text" width={'100px'} />
                  <Skeleton animation="wave" variant="rounded" height={'30px'} width={'75px'} />
                </Stack>
                <Skeleton animation="wave" variant="text" />
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton animation="wave" variant="text" width={'100px'} />
                  <Skeleton animation="wave" variant="text" width={'100px'} />
                </Stack>
              </CardContent>
            </Card>
            <Card
              elevation={1}
              sx={{
                width: '100%',
                ':hover': {
                  backgroundColor: (theme) => theme.palette.grey['100'],
                },
              }}
            >
              <CardContent>
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton animation="wave" variant="text" width={'100px'} />
                  <Skeleton animation="wave" variant="rounded" height={'30px'} width={'75px'} />
                </Stack>
                <Skeleton animation="wave" variant="text" />
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton animation="wave" variant="text" width={'100px'} />
                  <Skeleton animation="wave" variant="text" width={'100px'} />
                </Stack>
              </CardContent>
            </Card>
            <Card
              elevation={1}
              sx={{
                width: '100%',
                ':hover': {
                  backgroundColor: (theme) => theme.palette.grey['100'],
                },
              }}
            >
              <CardContent>
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton animation="wave" variant="text" width={'100px'} />
                  <Skeleton animation="wave" variant="rounded" height={'30px'} width={'75px'} />
                </Stack>
                <Skeleton animation="wave" variant="text" />
                <Stack
                  sx={{
                    width: '100%',
                  }}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Skeleton animation="wave" variant="text" width={'100px'} />
                  <Skeleton animation="wave" variant="text" width={'100px'} />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default withAuthenticationRequired(WorkflowListPage);
