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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Error } from '@mui/icons-material';
import ParamsMonaco from './ParamsMonaco';
import ExecMonaco from './ExecMonaco';
import { useReactFlow } from 'reactflow';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const functionConfigSchema = z.object({
  label: z
    .string({
      required_error: 'Label is required',
    })
    .min(1, 'Label is required'),
  params: z.record(z.string(), z.any()).refine((val) => !Object.keys(val).includes(''), 'Empty keys is not valid'),
  exec: z
    .string({
      required_error: 'Function code is required',
    })
    .min(1, 'Function code is required'),
  execTs: z
    .string({
      required_error: 'Function code typescript is required',
    })
    .min(1, 'Function code typescript is required'),
});

export type FunctionConfigSchema = z.infer<typeof functionConfigSchema>;

const Steps = ['Config', 'Function'];

interface Props {
  onSubmit: (value: FunctionConfigSchema) => void;
  initialValue: FunctionConfigSchema;
  deleteNode: Function;
  id: string;
}

const FunctionConfigPanel: FC<Props> = ({ onSubmit, initialValue, deleteNode, id }) => {
  const { getNodes } = useReactFlow();
  const [openConfigPanel, setOpenConfigPanel] = useState<boolean>(false);
  const [paramsEditorError, setParamsEditorError] = useState<string | null>(null);
  const [execEditorError, setExecEditorError] = useState<string | null>(null);
  const [labelUniqueError, setLabelUniqueError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  const { control, handleSubmit, formState, watch, setValue } = useForm<FunctionConfigSchema>({
    resolver: zodResolver(functionConfigSchema),
    values: {
      label: initialValue?.label ?? '',
      params: initialValue?.params ?? {},
      exec: initialValue?.exec ?? '',
      execTs:
        initialValue?.execTs ??
        `
/**
 * @returns {Promise<string>} Return JSON.stringify output. If you want to return any object, send it JSON.stringify. For null/undefined, return JSON.stringify({})
 * @see {@link https://docs.workflow-engine.com/Function_Task}
*/
async function handler(): Promise<string> {
  return JSON.stringify({});
}
      `,
    },
  });
  const labelValue = watch('label');
  const paramsObjectValue = watch('params');
  const execObjectValue = watch('execTs');

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

  const handleParamsEditorError = (error: string | null) => {
    setParamsEditorError(() => error);
  };

  const handleExecEditorError = (error: string | null) => {
    setExecEditorError(() => error);
  };

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
          Object.keys(formState.errors).length +
          (labelUniqueError ? 1 : 0) +
          (execEditorError ? 1 : 0) +
          (paramsEditorError ? 1 : 0)
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
              <Stepper activeStep={activeStep}>
                {Steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {activeStep === 0 && (
                <Stack
                  sx={{
                    paddingY: 4,
                  }}
                  rowGap={4}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                >
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

                  <Typography>Params:</Typography>

                  {paramsEditorError && (
                    <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} columnGap={2}>
                      <Error color="error" />
                      <Typography>{paramsEditorError}</Typography>
                    </Stack>
                  )}

                  <ParamsMonaco
                    initialValue={JSON.stringify(paramsObjectValue, undefined, 4)}
                    setValue={setValue}
                    setError={handleParamsEditorError}
                  />
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      setActiveStep(() => 1);
                    }}
                  >
                    Next
                  </Button>
                </Stack>
              )}
              {activeStep === 1 && (
                <Stack
                  sx={{
                    paddingY: 4,
                  }}
                  rowGap={4}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                >
                  <Typography>Function:</Typography>

                  {execEditorError && (
                    <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} columnGap={2}>
                      <Error color="error" />
                      <Typography>{execEditorError}</Typography>
                    </Stack>
                  )}

                  <ExecMonaco
                    initialValue={execObjectValue}
                    setValue={setValue}
                    setError={handleExecEditorError}
                    params={paramsObjectValue}
                  />
                  <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} columnGap={2}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setActiveStep(() => 0);
                      }}
                    >
                      Prev
                    </Button>
                    <Button variant="contained" type="submit">
                      Submit
                    </Button>
                  </Stack>
                </Stack>
              )}
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

export default FunctionConfigPanel;
