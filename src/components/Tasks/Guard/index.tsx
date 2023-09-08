import { Card, CardActions, CardHeader, Tooltip } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position, useReactFlow } from 'reactflow';

import ShieldIcon from '@mui/icons-material/Shield';
import type { GuardConfigSchema } from './Config';
import GuardConfigPanel from './Config';

interface DataProp {
  label: string;
  inputBoundId: string;
  outputBoundId: string;
  params: Record<string, any>;
  exec: string;
  execTs: string;
}

const GuardTask: FC<NodeProps<DataProp>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((curNode) => curNode.id !== id));
  }, [setNodes]);

  const changeValues = useCallback(
    (value: GuardConfigSchema) => {
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
        subheader={'Guard'}
        action={
          <Tooltip title={['ID', id].join(' : ')}>
            <ShieldIcon color="primary" />
          </Tooltip>
        }
      />
      <CardActions>
        <GuardConfigPanel id={id} initialValue={data} deleteNode={deleteNode} onSubmit={changeValues} />
      </CardActions>

      <Handle type="source" position={Position.Bottom} id={data?.outputBoundId} />
    </Card>
  );
};

export default GuardTask;
