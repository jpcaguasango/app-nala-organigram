import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import CustomNode from './components/CustomNode';
import TierNode from './components/TierNode';
import TiersAndNodes from './components/TiersAndNodes';
import useOrganigram from './hooks/useOrganigram';

import '@xyflow/react/dist/style.css';
import './App.css';

const nodeTypes = {
  tierNode: TierNode,
  customNode: CustomNode,
};

const Organigram = () => {
  const {
    tiers,
    nodes,
    edges,
    addTier,
    addNode,
    editTier,
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
          fitView
        >
          <MiniMap />
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>

      <TiersAndNodes
        tiers={tiers}
        nodes={nodes}
        addTier={addTier}
        addNode={addNode}
        editTier={editTier}
        onReset={onReset}
      />
    </div>
  );
};

export default Organigram;
