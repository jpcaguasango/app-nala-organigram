import { addEdge, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  fetchOrganigramData,
  resetOrganigramData,
  saveOrganigramData,
} from '../services/api';

const INIT_TIER_ID = uuidv4();
const INIT_NODE_ID = uuidv4();

const TIERS = {
  DEFAULT_TIERS: [
    {
      id: `tier-${INIT_TIER_ID}`,
      data: { label: 'Tier 1' },
      position: { x: 0, y: 0 },
      type: 'tierNode',
      draggable: false,
    },
  ],
  DEFAULT_HEIGHT: 350,
  DEFAULT_SPACING: 70,
};

const NODES = {
  DEFAULT_NODES: [
    {
      id: `node-${INIT_NODE_ID}`,
      data: {
        id: `node-${INIT_NODE_ID}`,
        label: 'New Position',
        employees: [],
      },
      position: { x: 100, y: TIERS.DEFAULT_SPACING },
      tier: `tier-${INIT_TIER_ID}`,
      type: 'customNode',
    },
  ],
};

const useActions = () => {
  const [tiers, setTiers] = useState([]);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const calculateNewTierIndex = useCallback(
    (positionY) =>
      Math.max(
        0,
        Math.min(tiers.length - 1, Math.round(positionY / TIERS.DEFAULT_HEIGHT))
      ),
    [tiers.length]
  );

  const calculateTierY = (tierIndex) =>
    tierIndex * TIERS.DEFAULT_HEIGHT + TIERS.DEFAULT_SPACING;

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          const change = changes.find((c) => c.id === node.id);

          if (
            change?.position &&
            !node.id.includes('tier') &&
            !isNaN(change.position.x) &&
            !isNaN(change.position.y)
          ) {
            const newTierIndex = calculateNewTierIndex(change.position.y);
            const tierId = tiers[newTierIndex].id;
            const tierY = calculateTierY(newTierIndex);

            return {
              ...node,
              position: { x: change.position.x, y: tierY },
              tier: tierId,
            };
          }

          return node;
        })
      );
    },
    [setNodes, calculateNewTierIndex, tiers]
  );

  const addTier = () => {
    const uniqueTierId = uuidv4();
    const newTierId = tiers.length;
    const newTierName = `Tier ${newTierId + 1}`;

    const newTierNode = {
      id: `tier-${uniqueTierId}`,
      data: { label: newTierName },
      position: { x: 0, y: newTierId * TIERS.DEFAULT_HEIGHT },
      type: 'tierNode',
      draggable: false,
    };

    setTiers([...tiers, newTierNode]);

    setNodes((prev) => [...prev, newTierNode]);
  };

  const editTier = (tierIndex, newLabel) => {
    const tierId = tiers[tierIndex].id;

    setTiers((prevTiers) =>
      prevTiers.map((tier) =>
        tier.id === tierId ? { ...tier, data: { label: newLabel } } : tier
      )
    );

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === tierId ? { ...node, data: { label: newLabel } } : node
      )
    );
  };

  const onAddEdge = (newNodeId) => {
    if (nodes.length === 0) return;

    const parentNode = nodes.find((node) => !node.id.includes('tier'));

    if (parentNode) {
      setEdges((prevEdges) => [
        ...prevEdges,
        {
          id: `e${parentNode.id}-${newNodeId}`,
          source: parentNode.id,
          target: newNodeId,
          type: 'step',
        },
      ]);
    }
  };

  const addEmployee = useCallback(
    (nodeId, employee) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  employees: [...(node.data.employees || []), employee],
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  const editEmployee = useCallback(
    (nodeId, employeeIndex, newEmployee) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  employees: node.data.employees.map((employee, index) =>
                    index === employeeIndex
                      ? { ...employee, ...newEmployee }
                      : employee
                  ),
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  const deleteEmployee = useCallback(
    (nodeId, employeeIndex) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  employees: node.data.employees.filter(
                    (_, index) => index !== employeeIndex
                  ),
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  const editNode = useCallback(
    (nodeId, newLabel) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    },
    [setNodes]
  );

  const addNode = (tierIndex) => {
    const newNodeId = `node-${uuidv4()}`;

    const newNode = {
      id: newNodeId,
      data: {
        id: newNodeId,
        label: `New Node`,
        employees: [],
        editNode,
        addEmployee,
        editEmployee,
        deleteEmployee,
      },
      position: {
        x: 100,
        y: tierIndex * TIERS.DEFAULT_HEIGHT + TIERS.DEFAULT_SPACING,
      },
      tier: `tier-${tierIndex + 1}`,
      type: 'customNode',
    };

    setNodes((prev) => [...prev, newNode]);
    onAddEdge(newNodeId);
  };

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const transformData = useCallback(
    (dataTiers = [], dataNodes = [], dataEdges = []) => {
      setTiers(dataTiers);
      setNodes([
        ...dataTiers,
        ...dataNodes
          .filter((n) => n.type !== 'tierNode')
          .map((node) => ({
            ...node,
            data: {
              ...node.data,
              editNode,
              addEmployee,
              editEmployee,
              deleteEmployee,
            },
          })),
      ]);
      setEdges(dataEdges);
    },
    [deleteEmployee, editEmployee, addEmployee, editNode, setEdges, setNodes]
  );

  const onReset = async () => {
    const response = await resetOrganigramData();

    if (response) {
      transformData(TIERS.DEFAULT_TIERS, NODES.DEFAULT_NODES);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const data = await fetchOrganigramData();

      if (data && data.tiers.length > 0 && data.nodes.length > 0) {
        transformData(data.tiers, data.nodes, data.edges);
      } else {
        transformData(TIERS.DEFAULT_TIERS, NODES.DEFAULT_NODES);
      }
    };

    initializeData();
  }, [setEdges, setNodes, setTiers, transformData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveOrganigramData({ tiers, nodes, edges });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [tiers, nodes, edges]);

  return {
    tiers,
    nodes,
    edges,
    addTier,
    addNode,
    addEmployee,
    editNode,
    editTier,
    onReset,
    onConnect,
    onNodesChange,
    onEdgesChange,
  };
};

export default useActions;
