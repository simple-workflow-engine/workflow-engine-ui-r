import 'reactflow/dist/style.css';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import type { FC, MouseEvent, ReactElement, Ref } from 'react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Connection, Edge } from 'reactflow';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import CloseIcon from '@mui/icons-material/Close';
import { z } from 'zod';
import WorkflowGlobalMonaco from '../WorkflowGlobalMonaco';
import { Error } from '@mui/icons-material';
import FunctionsIcon from '@mui/icons-material/Functions';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { LoadingButton } from '@mui/lab';
import { httpClient } from '@/lib/http/httpClient';
import { useAuth0 } from '@auth0/auth0-react';
import { enqueueSnackbar } from 'notistack';
import { useWorkflowDefinitionContext } from '@/contexts/WorkflowDefinitionContext';
import { useNavigate } from 'react-router-dom';
import type { ResponseSchemaType } from '@/api/WorkflowDefinitionSingle/api';
import ShieldIcon from '@mui/icons-material/Shield';
import PanToolIcon from '@mui/icons-material/PanTool';
import { nodeTypes, taskCreator } from '@lib/creators/task';
import WebhookIcon from '@mui/icons-material/Webhook';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const workflowMetadataFormSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1, 'Name is required'),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .min(1, 'Description is required'),
  global: z.record(z.string(), z.any()).refine((val) => !Object.keys(val).includes(''), 'Empty keys is not valid'),
  status: z.enum(['active', 'inactive']),
});

type WorkflowMetadataFormSchema = z.infer<typeof workflowMetadataFormSchema>;

interface Props {
  definition: ResponseSchemaType;
}

const WorkflowEdit: FC<Props> = ({ definition }) => {
  const { setConfig } = useWorkflowDefinitionContext();
  const { getAccessTokenSilently, logout } = useAuth0();
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const open = Boolean(menuEl);

  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const [nodes, _, onNodesChange] = useNodesState(definition.uiObject.react.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(definition.uiObject.react.edges);
  const { addNodes } = useReactFlow();

  const [definitionDialog, setDefinitionDialog] = useState<boolean>(false);

  const [globalEditorError, setGlobalEditorError] = useState<string | null>(null);

  const { control, setValue, watch, handleSubmit, formState } = useForm<WorkflowMetadataFormSchema>({
    resolver: zodResolver(workflowMetadataFormSchema),
    mode: 'all',
    values: {
      name: definition.name,
      description: definition.description,
      global: definition?.global ?? {},
      status: definition.status,
    },
  });

  const globalObjectValue = watch('global');

  useEffect(() => {
    setConfig(globalObjectValue);
  }, [globalObjectValue]);

  const handleGlobalEditorError = (error: string | null) => {
    setGlobalEditorError(() => error);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const deleteEdge = useCallback(
    (edge: Edge) => {
      setEdges((edges) => edges.filter((curEdge) => curEdge.id !== edge.id));
    },
    [setEdges]
  );

  const openDefinitionDialog = () => {
    setDefinitionDialog(() => true);
  };

  const closeDefinitionDialog = () => {
    setDefinitionDialog(() => false);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuEl(() => event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuEl(() => null);
  };

  const addNewTask = (type: keyof typeof taskCreator) => {
    addNodes(taskCreator[type]());
    handleMenuClose();
  };

  const submitHandle = handleSubmit(async (values) => {
    setFormLoading(() => true);

    const parsedTask = nodes.map((item) => ({
      id: item?.id,
      name: item.data?.label,
      type: item.type?.toUpperCase(),
      params: item?.data?.params ?? {},
      next: edges
        .filter((val) => val?.sourceHandle === item?.data?.outputBoundId)
        .map((edge) => nodes.find((node) => node.id === edge.target)?.data?.label)
        .filter((v) => !!v),
      previous: edges
        .filter((val) => val?.targetHandle === item?.data?.inputBoundId)
        .map((edge) => nodes.find((node) => node.id === edge.source)?.data?.label)
        .filter((v) => !!v),
      ...(item?.data?.exec && {
        exec: item?.data?.exec,
      }),
      ...(item?.data?.execTs && {
        execTs: item?.data?.execTs,
      }),
    }));

    const workflowData = {
      name: values.name,
      description: values.description,
      global: values.global,
      tasks: parsedTask,
      status: values.status,
    };

    const token = await getAccessTokenSilently();

    if (!token) {
      enqueueSnackbar('Unauthorized', {
        variant: 'error',
        autoHideDuration: 2 * 1000,
      });
      logout();
    }

    await httpClient
      .put(
        `/definition/edit/${definition._id}`,
        {
          workflowData,
          key: 'react',
          ui: {
            nodes,
            edges,
          },
        },
        {
          headers: {
            Authorization: ['Bearer', token].join(' '),
          },
        }
      )
      .then(() => {
        enqueueSnackbar('Workflow updated successfully', {
          variant: 'success',
          autoHideDuration: 2 * 1000,
        });
        navigate(`/workflows/${definition._id}`);
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar('Workflow updated failed', {
          variant: 'error',
          autoHideDuration: 2 * 1000,
        });
      })
      .finally(() => {
        setFormLoading(() => false);
      });
  });

  return (
    <Box>
      <Stack
        sx={{
          height: '80vh',
          width: '100%',
        }}
        justifyContent={'flex-start'}
        alignItems={'flex-start'}
        rowGap={4}
      >
        <Stack
          sx={{
            width: '100%',
          }}
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          columnGap={2}
        >
          <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} columnGap={2}>
            <Badge color="error" badgeContent={Object.keys(formState?.errors).length}>
              <Button variant="outlined" onClick={openDefinitionDialog}>
                Configure Definition
              </Button>
            </Badge>
            <Button variant="contained" onClick={handleMenuOpen}>
              Add Task
            </Button>

            <Menu
              id="basic-menu"
              anchorEl={menuEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => addNewTask('function')}>
                <ListItemIcon>
                  <FunctionsIcon />
                </ListItemIcon>
                <ListItemText>Function</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => addNewTask('start')}>
                <ListItemIcon>
                  <PlayCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText>Start</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => addNewTask('end')}>
                <ListItemIcon>
                  <StopCircleIcon />
                </ListItemIcon>
                <ListItemText>End</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => addNewTask('guard')}>
                <ListItemIcon>
                  <ShieldIcon />
                </ListItemIcon>
                <ListItemText>Guard</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => addNewTask('wait')}>
                <ListItemIcon>
                  <PanToolIcon />
                </ListItemIcon>
                <ListItemText>Wait</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => addNewTask('listen')}>
                <ListItemIcon>
                  <WebhookIcon />
                </ListItemIcon>
                <ListItemText>Listen</ListItemText>
              </MenuItem>
            </Menu>
          </Stack>
          <LoadingButton variant="contained" loading={formLoading} onClick={submitHandle}>
            Submit
          </LoadingButton>
        </Stack>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onEdgeDoubleClick={(e, edge) => {
            e.preventDefault();
            e.stopPropagation();
            deleteEdge(edge);
          }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
        <Dialog fullScreen open={definitionDialog} onClose={closeDefinitionDialog} TransitionComponent={Transition}>
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={closeDefinitionDialog} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Configure Definition
              </Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg">
            <Stack
              sx={{
                padding: 2,
              }}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
              rowGap={4}
            >
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Name"
                    placeholder="Name of the definition"
                    error={!!fieldState?.error?.message}
                    helperText={fieldState?.error?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Description"
                    placeholder="Description about the definition"
                    error={!!fieldState?.error?.message}
                    helperText={fieldState?.error?.message}
                    multiline
                    fullWidth
                    minRows={4}
                  />
                )}
              />
              <Controller
                control={control}
                name="status"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Status"
                    placeholder="Status of the definition"
                    error={!!fieldState?.error?.message}
                    helperText={fieldState?.error?.message}
                    select
                    fullWidth
                  >
                    <MenuItem value={'active'}>Active</MenuItem>
                    <MenuItem value={'inactive'}>Inactive</MenuItem>
                  </TextField>
                )}
              />
              <Typography>Global:</Typography>
              {globalEditorError && (
                <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} columnGap={2}>
                  <Error color="error" />
                  <Typography>{globalEditorError}</Typography>
                </Stack>
              )}

              <WorkflowGlobalMonaco
                initialValue={JSON.stringify(globalObjectValue, undefined, 4)}
                setValue={setValue}
                setError={handleGlobalEditorError}
              />
            </Stack>
          </Container>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default WorkflowEdit;
