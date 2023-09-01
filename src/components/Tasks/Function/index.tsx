import { Card, CardActions, CardHeader, Tooltip } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position, useReactFlow } from 'reactflow';

import FunctionsIcon from '@mui/icons-material/Functions';
import type { FunctionConfigSchema } from './Config';
import FunctionConfigPanel from './Config';

interface DataProp {
  label: string;
  inputBoundId: string;
  outputBoundId: string;
}

const FunctionTask: FC<NodeProps<DataProp>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((curNode) => curNode.id !== id));
  }, [setNodes]);

  const changeValues = useCallback(
    (value: FunctionConfigSchema) => {
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
      <Handle type="target" position={Position.Top} id={data?.inputBoundId} />

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
        <FunctionConfigPanel initialValue={data} deleteNode={deleteNode} onSubmit={changeValues} />
      </CardActions>

      <Handle type="source" position={Position.Bottom} id={data?.outputBoundId} />
    </Card>
  );
};

export default FunctionTask;
