import { addEdge, useEdgesState, useNodesState } from '@xyflow/react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  fetchOrganigramData,
  resetOrganigramData,
  saveOrganigramData,
} from '../services/api';

const INIT_NODE_ID = uuidv4();

const NODES = {
  DEFAULT_NODES: [
    {
      id: `node-${INIT_NODE_ID}`,
      data: {
        id: `node-${INIT_NODE_ID}`,
        label: 'New Position',
        isParent: true,
        employees: [],
      },
      position: { x: 100, y: 100 },
      type: 'customNode',
    },
  ],
};

const useOrganigram = () => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onNodesChange = (changes) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const change = changes.find((c) => c.id === node.id);

        if (change?.position && !isNaN(change.position.x) && !isNaN(change.position.y)) {
          return {
            ...node,
            position: { x: change.position.x, y: change.position.y },
          };
        }

        return node;
      })
    );
  };

  const onAddEdge = (parentNodeId, newNodeId) => {
    if (nodes.length === 0) return;

    if (parentNodeId) {
      setEdges((prevEdges) => [
        ...prevEdges,
        {
          id: `e${parentNodeId}-${newNodeId}`,
          source: parentNodeId,
          target: newNodeId,
          type: 'step',
        },
      ]);
    }
  };

  const addEmployee = (nodeId, employee) => {
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
  };

  const editEmployee = (nodeId, employeeIndex, newEmployee) => {
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
  };

  const deleteEmployee = (nodeId, employeeIndex) => {
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
  };

  const editNode = (nodeId, newLabel) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  };

  const addNode = (parentNodeId) => {
    const parentNode = nodes.find((node) => node.id === parentNodeId);

    if (!parentNode) return;

    const newNodeId = `node-${uuidv4()}`;

    const newNode = {
      id: newNodeId,
      data: {
        id: newNodeId,
        label: `New Position`,
        isParent: false,
        employees: [],
        editNode,
        addEmployee,
        editEmployee,
        deleteEmployee,
        addNode,
      },
      position: {
        x: parentNode.position.x,
        y: parentNode.position.y + 500,
      },
      type: 'customNode',
    };

    setNodes((prev) => [...prev, newNode]);
    onAddEdge(parentNodeId, newNodeId);
  };

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const transformData = (dataNodes = [], dataEdges = []) => {
    setNodes(
      dataNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          editNode,
          addEmployee,
          editEmployee,
          deleteEmployee,
          addNode: (nodeId) => addNode(nodeId, dataNodes),
        },
      }))
    );
    setEdges(dataEdges);
  };

  const onReset = async () => {
    const response = await resetOrganigramData();

    if (response) {
      transformData(NODES.DEFAULT_NODES);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const data = await fetchOrganigramData();

      if (data && data.nodes.length > 0) {
        transformData(data.nodes, data.edges);
      } else {
        transformData(NODES.DEFAULT_NODES);
      }
    };
    initializeData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveOrganigramData({ nodes, edges });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges]);

  useEffect(() => {
    transformData(nodes, edges);
  }, [nodes.length]);

  return {
    nodes,
    edges,
    addNode,
    addEmployee,
    editNode,
    onReset,
    onConnect,
    onNodesChange,
    onEdgesChange,
  };
};

export default useOrganigram;
