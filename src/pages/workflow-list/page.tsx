import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Box } from '@mui/material';
import type { ChangeEventHandler } from 'react';
import { type FC, useCallback } from 'react';
import type { Connection, Edge, Node, NodeTypes } from 'reactflow';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';

import 'reactflow/dist/style.css';

interface Props {}

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' }, type: 'custom' },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

const nodeTypes: NodeTypes = {
  custom: () => {
    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((evt) => {
      console.log(evt.target.value);
    }, []);
    return (
      <>
        <Handle type="target" position={Position.Top} />
        <div>
          <label htmlFor="text">Text:</label>
          <input id="text" name="text" onChange={onChange} className="nodrag" />
        </div>
        <Handle type="source" position={Position.Bottom} id="a" />
        <Handle type="source" position={Position.Bottom} id="b" style={{ left: 15 }} />
      </>
    );
  },
};

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true, updatable: true }];

const WorkflowListPage: FC<Props> = () => {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const deleteEdge = useCallback(
    (edge: Edge) => {
      setEdges((edges) => edges.filter((curEdge) => curEdge.id !== edge.id));
    },
    [setEdges]
  );

  return (
    <Box
      sx={{
        height: '80vh',
        padding: 3,
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onEdgeDoubleClick={(_, edge) => deleteEdge(edge)}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </Box>
  );
};

export default withAuthenticationRequired(WorkflowListPage);
