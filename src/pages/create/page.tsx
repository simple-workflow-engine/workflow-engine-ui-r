import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Box } from '@mui/material';
import { type FC } from 'react';

import { ReactFlowProvider } from 'reactflow';

import WorkflowCreate from '../workflow-list/components/WorkflowCreate';

interface Props {}

const WorkflowDefinitionCreatePage: FC<Props> = () => (
  <Box
    sx={{
      height: '80vh',
      padding: 3,
    }}
  >
    <ReactFlowProvider>
      <WorkflowCreate />
    </ReactFlowProvider>
  </Box>
);

export default withAuthenticationRequired(WorkflowDefinitionCreatePage);
