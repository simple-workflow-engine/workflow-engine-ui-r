import { Button, Stack, Typography } from '@mui/material';
import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Props {}

const NotFoundPage: FC<Props> = () => {
  const location = useLocation();
  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      rowGap={2}
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <Typography>Can not found `{location.pathname}`</Typography>
      <Link to="/">
        <Button variant="outlined">Go to Home</Button>
      </Link>
    </Stack>
  );
};

export default NotFoundPage;
