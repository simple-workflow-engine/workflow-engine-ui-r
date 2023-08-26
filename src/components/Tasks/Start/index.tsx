import { zodResolver } from '@hookform/resolvers/zod';
import {
  Slide,
  Card,
  CardHeader,
  Tooltip,
  CardActions,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Stack,
  TextField,
} from '@mui/material';
import type { TransitionProps } from 'notistack';
import { useSnackbar } from 'notistack';
import type { FC, ReactElement, Ref } from 'react';
import { forwardRef, useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { NodeProps } from 'reactflow';
import { Handle, Position, useReactFlow } from 'reactflow';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { z } from 'zod';

const startConfigSchema = z.object({
  label: z
    .string({
      required_error: 'Label is required',
    })
    .min(1, 'Label is required'),
});

type StartConfigSchema = z.infer<typeof startConfigSchema>;

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface DataProps {
  label: string;
  outputBoundId: string;
}

const StartTask: FC<NodeProps<DataProps>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

  const [openConfigPanel, setOpenConfigPanel] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit } = useForm<StartConfigSchema>({
    resolver: zodResolver(startConfigSchema),
    values: {
      label: data?.label ?? '',
    },
  });

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((curNode) => curNode.id !== id));
  }, [setNodes]);

  const changeValues = useCallback(
    (value: StartConfigSchema) => {
      const currentNode = getNode(id);
      if (currentNode) {
        const newData = {
          ...currentNode.data,
          ...value,
        };
        setNodes((nodes) =>
          nodes.map((curNode) =>
            curNode.id == id
              ? {
                  ...curNode,
                  data: newData,
                }
              : curNode
          )
        );
      }
    },
    [setNodes]
  );

  const handleConfigPanelOpen = () => {
    setOpenConfigPanel(() => true);
  };

  const handleConfigPanelClose = () => {
    setOpenConfigPanel(() => false);
  };

  const submitHandler = handleSubmit(async (value) => {
    changeValues(value);
    enqueueSnackbar('Config changed successfully', {
      variant: 'success',
      autoHideDuration: 2 * 1000,
    });
    handleConfigPanelClose();
  });

  return (
    <Card>
      <CardHeader
        title={data?.label ?? ''}
        subheader={'Start'}
        action={
          <Tooltip title={['ID', id].join(' : ')}>
            <PlayCircleOutlineIcon color="primary" />
          </Tooltip>
        }
      />
      <CardActions>
        <Button variant="outlined" onClick={handleConfigPanelOpen}>
          Configure
        </Button>
        <Dialog fullScreen open={openConfigPanel} onClose={handleConfigPanelClose} TransitionComponent={Transition}>
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleConfigPanelClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {[data?.label, 'Configuration'].join(' ')}
              </Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg">
            <Stack
              sx={{
                paddingY: 2,
                paddingX: 2,
              }}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
              rowGap={2}
            >
              <form
                style={{
                  width: '100%',
                }}
                onSubmit={submitHandler}
              >
                <Stack rowGap={4}>
                  <Controller
                    control={control}
                    name="label"
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Label"
                        placeholder="Name of the Task"
                        error={!!fieldState?.error?.message}
                        helperText={fieldState?.error?.message}
                        fullWidth
                      />
                    )}
                  />

                  <Button variant="contained" type="submit">
                    Submit
                  </Button>
                </Stack>
              </form>
              <Button
                variant="contained"
                color="error"
                type="button"
                onClick={() => {
                  deleteNode();
                }}
              >
                Delete Task
              </Button>
            </Stack>
          </Container>
        </Dialog>
      </CardActions>

      <Handle type="source" position={Position.Bottom} id={data?.outputBoundId} />
    </Card>
  );
};

export default StartTask;
