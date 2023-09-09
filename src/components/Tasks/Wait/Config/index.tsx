import { zodResolver } from '@hookform/resolvers/zod';
import type { TransitionProps } from 'notistack';
import { useSnackbar } from 'notistack';
import type { FC, ReactElement, Ref } from 'react';
import { forwardRef, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Stack,
  TextField,
  Slide,
  Badge,
  Autocomplete,
} from '@mui/material';
import { useReactFlow } from 'reactflow';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const waitConfigSchema = z.object({
  label: z
    .string({
      required_error: 'Label is required',
    })
    .min(1, 'Label is required'),
  params: z.object({
    taskNames: z.array(z.string()),
  }),
});

export type WaitConfigSchema = z.infer<typeof waitConfigSchema>;

interface Props {
  onSubmit: (value: WaitConfigSchema) => void;
  initialValue: WaitConfigSchema;
  deleteNode: Function;
  id: string;
}

const WaitConfigPanel: FC<Props> = ({ onSubmit, initialValue, deleteNode, id }) => {
  const { getNodes } = useReactFlow();
  const [openConfigPanel, setOpenConfigPanel] = useState<boolean>(false);
  const [labelUniqueError, setLabelUniqueError] = useState<string | null>(null);
  const [taskNamesUnknownError, setTaskNamesUnknownError] = useState<string | null>(null);

  const { control, handleSubmit, formState, watch } = useForm<WaitConfigSchema>({
    resolver: zodResolver(waitConfigSchema),
    values: {
      label: initialValue?.label ?? '',
      params: initialValue?.params ?? {
        taskNames: [],
      },
    },
  });

  const taskNamesValue = watch('params.taskNames');
  const labelValue = watch('label');

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nodes = getNodes();

      if (
        nodes
          .filter((node) => node.id !== id)
          .map((node) => node?.data?.label)
          .includes(labelValue)
      ) {
        setLabelUniqueError(() => 'Task name already exist');
      } else {
        setLabelUniqueError(() => null);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [labelValue]);

  useEffect(() => {
    const nodes = getNodes().map((node) => node.data?.label);

    const unknownNodes = taskNamesValue.filter((item) => !nodes.includes(item));

    if (unknownNodes && unknownNodes.length > 0) {
      setTaskNamesUnknownError(() => `${unknownNodes.join(', ')} is/are unknown Tasks`);
    } else {
      setTaskNamesUnknownError(() => null);
    }
  }, [taskNamesValue]);

  const submitHandler = handleSubmit(async (value) => {
    onSubmit(value);
    enqueueSnackbar('Config changed successfully', {
      variant: 'success',
      autoHideDuration: 2 * 1000,
    });
    handleConfigPanelClose();
  });

  const handleConfigPanelOpen = () => {
    setOpenConfigPanel(() => true);
  };

  const handleConfigPanelClose = () => {
    setOpenConfigPanel(() => false);
  };

  return (
    <>
      <Badge
        color="error"
        badgeContent={
          Object.keys(formState.errors).length + (labelUniqueError ? 1 : 0) + (taskNamesUnknownError ? 1 : 0)
        }
      >
        <Button variant="outlined" onClick={handleConfigPanelOpen}>
          Configure
        </Button>
      </Badge>
      <Dialog fullScreen open={openConfigPanel} onClose={handleConfigPanelClose} TransitionComponent={Transition}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleConfigPanelClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {[initialValue?.label, 'Configuration'].join(' ')}
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
                      error={!!fieldState?.error?.message || !!labelUniqueError}
                      helperText={labelUniqueError ?? fieldState?.error?.message}
                      fullWidth
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="params.taskNames"
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      onChange={(_, value) => {
                        field.onChange(value);
                      }}
                      multiple
                      options={
                        getNodes()
                          ?.filter((node) => node.id !== id)
                          ?.map((node) => node.data.label) ?? []
                      }
                      getOptionLabel={(option) => option}
                      disablePortal
                      value={taskNamesValue}
                      isOptionEqualToValue={(option, val) => option === val}
                      renderInput={(params) => (
                        <TextField
                          {...field}
                          {...params}
                          error={!!fieldState.error?.message || !!taskNamesUnknownError}
                          helperText={taskNamesUnknownError ?? fieldState.error?.message}
                          variant="outlined"
                          label="Tasks"
                          placeholder="Which task to wait"
                          fullWidth
                        />
                      )}
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
    </>
  );
};

export default WaitConfigPanel;
