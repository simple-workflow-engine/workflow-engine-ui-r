import { Card, CardHeader, Tooltip, CardActions } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position, useReactFlow } from 'reactflow';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import type { StartConfigSchema } from './Config';
import StartConfigPanel from './Config';

interface DataProps {
  label: string;
  outputBoundId: string;
}

const StartTask: FC<NodeProps<DataProps>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

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
        <StartConfigPanel initialValue={data} deleteNode={deleteNode} onSubmit={changeValues} />
      </CardActions>

      <Handle type="source" position={Position.Bottom} id={data?.outputBoundId} />
    </Card>
  );
};

export default StartTask;
