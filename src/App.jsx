import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import CustomNode from './components/CustomNode';
import TierNode from './components/TierNode';
import useOrganigram from './hooks/useOrganigram';

import { Button } from '@mui/material';
import '@xyflow/react/dist/style.css';
import './App.css';

const nodeTypes = {
  tierNode: TierNode,
  customNode: CustomNode,
};

const Organigram = () => {
  const {
    nodes,
    edges,
    onReset,
    onConnect,
    onNodesChange,
    onEdgesChange,
  } = useOrganigram();

  return (
    <div style={{ display: 'flex', height: '95vh' }}>
      <div
        style={{
          flex: 4,
          position: 'relative',
          border: '1px solid #ccc',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          isValidConnection={() => false}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background variant="dots" gap={12} size={1} />
          <Button
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 4,
            }}
            variant="contained"
            onClick={onReset}
          >
            Reset Organigram
          </Button>
        </ReactFlow>
      </div>
    </div>
  );
};

export default Organigram;
