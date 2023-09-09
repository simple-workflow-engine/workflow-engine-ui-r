import { Card, CardHeader, Tooltip, CardActions } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { WaitConfigSchema } from './Config';
import WaitConfigPanel from './Config';
import PanToolIcon from '@mui/icons-material/PanTool';

interface DataProps {
  label: string;
  params: { taskNames: string[] };
  inputBoundId: string;
  outputBoundId: string;
}

const WaitTask: FC<NodeProps<DataProps>> = ({ data, id }) => {
  const { setNodes, getNode } = useReactFlow();

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((curNode) => curNode.id !== id));
  }, [setNodes]);

  const changeValues = useCallback(
    (value: WaitConfigSchema) => {
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
        subheader={'Wait'}
        action={
          <Tooltip title={['ID', id].join(' : ')}>
            <PanToolIcon color="primary" />
          </Tooltip>
        }
      />
      <CardActions>
        <WaitConfigPanel id={id} initialValue={data} deleteNode={deleteNode} onSubmit={changeValues} />
      </CardActions>

      <Handle type="source" position={Position.Bottom} id={data?.outputBoundId} />
    </Card>
  );
};

export default WaitTask;
