import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Typography } from '@mui/material';
import { type FC } from 'react';

interface Props {}

const WorkflowListPage: FC<Props> = () => <Typography variant="h3">Workflow Engine List</Typography>;

export default withAuthenticationRequired(WorkflowListPage);
