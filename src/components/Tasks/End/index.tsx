import { Card, CardHeader, Tooltip, CardActions } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position, useReactFlow } from 'reactflow';
import StopCircleIcon from '@mui/icons-material/StopCircle';

import type { EndConfigSchema } from './Config';
import EndConfigPanel from './Config';

interface DataProps {
  label: string;
  inputBoundId: string;
}

const EndTask: FC<NodeProps<DataProps>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((curNode) => curNode.id !== id));
  }, [setNodes]);

  const changeValues = useCallback(
    (value: EndConfigSchema) => {
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
      <Handle type="target" position={Position.Top} id={data.inputBoundId} />
      <CardHeader
        title={data.label}
        subheader={'End'}
        action={
          <Tooltip title={['ID', id].join(' : ')}>
            <StopCircleIcon color="primary" />
          </Tooltip>
        }
      />
      <CardActions>
        <EndConfigPanel initialValue={data} deleteNode={deleteNode} onSubmit={changeValues} />
      </CardActions>
    </Card>
  );
};

export default EndTask;
