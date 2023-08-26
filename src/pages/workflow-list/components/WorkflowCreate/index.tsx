import 'reactflow/dist/style.css';
import FunctionTask from '@/components/Tasks/Function';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AppBar,
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
import { forwardRef, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Connection, Edge, Node, NodeTypes } from 'reactflow';
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

const nodeTypes: NodeTypes = {
  function: FunctionTask,
};

const taskCreator: Record<'function', () => Node> = {
  function: () => ({
    id: crypto.randomUUID(),
    data: {
      label: 'New Function',
      inputBounds: [
        {
          id: crypto.randomUUID(),
        },
      ],
      outputBounds: [
        {
          id: crypto.randomUUID(),
        },
      ],
    },
    position: { x: 100, y: 100 },
    type: 'function',
  }),
};

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 100, y: 50 },
    data: { label: '1', inputBounds: [{ id: 'a' }], outputBounds: [{ id: 'a' }] },
    type: 'function',
  },
  { id: '2', position: { x: 300, y: 100 }, data: { label: '2' } },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true, updatable: true }];

interface Props {}

const WorkflowCreate: FC<Props> = () => {
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const open = Boolean(menuEl);

  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { addNodes } = useReactFlow();

  const [definitionDialog, setDefinitionDialog] = useState<boolean>(false);

  const [globalEditorError, setGlobalEditorError] = useState<string | null>(null);

  const { control, setValue, watch } = useForm<WorkflowMetadataFormSchema>({
    resolver: zodResolver(workflowMetadataFormSchema),
    mode: 'all',
    values: {
      name: '',
      description: '',
      global: {},
      status: 'active',
    },
  });

  const globalObjectValue = watch('global');

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
        <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} columnGap={2}>
          <Button variant="outlined" onClick={openDefinitionDialog}>
            Configure Definition
          </Button>
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
          </Menu>
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
          <AppBar sx={{ position: 'relative' }}>
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
              rowGap={2}
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

export default WorkflowCreate;
