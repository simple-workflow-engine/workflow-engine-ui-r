import { CircularProgress, Stack, Typography } from '@mui/material';
import type { FC } from 'react';

interface Props {}

const PageLoader: FC<Props> = () => (
  <Stack
    sx={{
      width: '100%',
      height: '100%',
    }}
    justifyContent={'center'}
    alignItems={'center'}
    rowGap={2}
  >
    <CircularProgress />
    <Typography>Loading Page...</Typography>
  </Stack>
);

export default PageLoader;
