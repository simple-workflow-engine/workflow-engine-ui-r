import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardHeader,
  Dialog,
  IconButton,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import type { FC, ReactElement, Ref } from 'react';
import { forwardRef, useCallback, useState } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position, useReactFlow } from 'reactflow';
import CloseIcon from '@mui/icons-material/Close';
import FunctionsIcon from '@mui/icons-material/Functions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface DataProp {
  label: string;
  inputBounds: Array<{
    id: string;
  }>;
  outputBounds: Array<{
    id: string;
  }>;
}

const FunctionTask: FC<NodeProps<DataProp>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

  const [openConfigPanel, setOpenConfigPanel] = useState<boolean>(false);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((curNode) => curNode.id !== id));
  }, [setNodes]);

  const changeLabel = useCallback(
    (value: string) => {
      const currentNode = getNode(id);
      if (currentNode) {
        const newData = {
          ...currentNode.data,
          label: value,
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

  return (
    <Card>
      {data?.inputBounds?.map((item, index) => (
        <Handle
          key={item.id}
          type="target"
          position={Position.Top}
          id={item.id}
          style={{
            left: index * 5,
          }}
        />
      ))}
      <CardHeader
        title={data?.label ?? ''}
        subheader={'Function'}
        action={
          <Tooltip title={['ID', id].join(' : ')}>
            <FunctionsIcon color="primary" />
          </Tooltip>
        }
      />
      <CardActions>
        <Button variant="outlined" onClick={handleConfigPanelOpen}>
          Configure
        </Button>
        <Dialog fullScreen open={openConfigPanel} onClose={handleConfigPanelClose} TransitionComponent={Transition}>
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleConfigPanelClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {[data?.label, 'Configuration'].join(' ')}
              </Typography>
            </Toolbar>
          </AppBar>
          <Stack
            sx={{
              paddingY: 2,
              paddingX: 2,
            }}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            rowGap={2}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                deleteNode();
              }}
            >
              Delete
            </Button>
            <TextField
              value={data?.label ?? ''}
              onChange={(e) => {
                changeLabel(e.target.value);
              }}
              name="label"
            />
          </Stack>
        </Dialog>
      </CardActions>
      {data?.outputBounds?.map((item, index) => (
        <Handle
          key={item.id}
          type="source"
          position={Position.Bottom}
          id={item.id}
          style={{
            left: index * 10,
          }}
        />
      ))}
    </Card>
  );
};

export default FunctionTask;
