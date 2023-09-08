import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { type FC } from 'react';

interface Props {}

const HomePage: FC<Props> = () => (
  <Stack
    sx={{
      paddingY: 2,
    }}
    rowGap={4}
  >
    <Typography
      component="h1"
      variant="h2"
      sx={{
        width: '100%',
        textAlign: 'center',
        fontWeight: 500,
        fontSize: {
          md: '56px',
          sm: '42px',
          xs: '36px',
        },
      }}
    >
      Workflow Engine For Developers
    </Typography>
    <Typography
      variant="subtitle1"
      sx={{
        width: '100%',
        textAlign: 'center',
        fontWeight: 400,
        fontSize: { sm: '26px', xs: '20px' },
      }}
    >
      Workflow That You Can Decode and Debug
    </Typography>

    <img
      style={{
        width: 'auto',
        height: '500px',
        aspectRatio: '16/9',
        objectFit: 'contain',
      }}
      src="/workflow-ill.jpg"
      title="Image by vectorjuice on Freepik"
      alt="workflow illustration"
      loading="lazy"
    />
  </Stack>
);

export default HomePage;
