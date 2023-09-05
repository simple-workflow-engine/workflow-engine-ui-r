import { httpClient } from '@/lib/http/httpClient';
import { useAuth0 } from '@auth0/auth0-react';
import { useSnackbar } from 'notistack';
import type { ElementRef, FC } from 'react';
import { useRef, useState } from 'react';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import type { OnChange, OnMount } from '@monaco-editor/react';
import { Editor } from '@monaco-editor/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Error } from '@mui/icons-material';
import { AxiosError } from 'axios';

const startNowSchema = z.object({
  global: z.record(z.string(), z.any()).refine((val) => !Object.keys(val).includes(''), 'Empty keys is not valid'),
});

type StartNowSchema = z.infer<typeof startNowSchema>;

interface Props {
  workflowDefinitionId: string;
  refetch: Function;
}

const StartNowDialog: FC<Props> = ({ workflowDefinitionId, refetch }) => {
  const { getAccessTokenSilently, logout } = useAuth0();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const editorRef = useRef<ElementRef<typeof Editor>>();

  const [startWorkflowLoading, setStartWorkflowLoading] = useState<boolean>(false);

  const { handleSubmit, setValue, reset, formState } = useForm<StartNowSchema>({
    resolver: zodResolver(startNowSchema),
    values: {
      global: {},
    },
  });

  const handleDialogOpen = () => {
    setOpen(() => true);
  };

  const handleDialogClose = () => {
    reset();
    setOpen(() => false);
  };

  const handleChange: OnChange = (value) => {
    if (value) {
      try {
        const parsedObject = JSON.parse(value);

        if (
          Object.keys(parsedObject)
            .map((k) => k?.trim())
            .includes('')
        ) {
          setError('No empty keys');
        } else {
          setValue('global', parsedObject);
          setError(null);
        }
      } catch (_error) {
        setError('Error parsing JSON');
      }
    }
  };

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const startWorkflowHandler = handleSubmit(async (values) => {
    setStartWorkflowLoading(() => true);

    const token = await getAccessTokenSilently();
    if (!token) {
      enqueueSnackbar('Unauthorized');
      logout();
      setStartWorkflowLoading(() => false);
      return;
    }

    httpClient
      .post(
        '/workflow/start',
        {
          workflowDefinitionId,
          globalParams: values.global,
        },
        {
          headers: {
            Authorization: ['Bearer', token].join(' '),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        enqueueSnackbar('Workflow started successfully', {
          variant: 'success',
          autoHideDuration: 2 * 1000,
        });
        refetch();
        handleDialogClose();
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          console.error(error?.response?.data);
        } else {
          console.error(error);
        }
        enqueueSnackbar('Workflow start failed', {
          variant: 'error',
          autoHideDuration: 2 * 1000,
        });
      })
      .finally(() => {
        setStartWorkflowLoading(() => false);
      });
  });

  return (
    <>
      <Button variant="outlined" onClick={handleDialogOpen} startIcon={<PlayCircleFilledWhiteOutlinedIcon />}>
        Start Now
      </Button>

      <Dialog fullWidth={true} maxWidth={'md'} open={open} onClose={handleDialogClose}>
        <DialogTitle>Start Now</DialogTitle>
        <DialogContent>
          <Stack rowGap={2}>
            <Typography>Global Params:</Typography>
            {!!error && (
              <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} columnGap={2}>
                <Error color="error" />
                <Typography>{error}</Typography>
              </Stack>
            )}
            <Editor
              defaultValue={JSON.stringify({}, undefined, 4)}
              onMount={onMount}
              onChange={handleChange}
              language="json"
              height={'30vh'}
              theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleDialogClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={startWorkflowLoading}
            variant="contained"
            onClick={startWorkflowHandler}
            disabled={!!error || !formState.isValid}
          >
            Start
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StartNowDialog;
