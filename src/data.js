export const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { name: "COO", job: "CEO", emoji: "👨‍💼" },
    type: "custom",
  },
  {
    id: "2",
    position: { x: -400, y: 300 },
    data: { name: "Business Operations", emoji: "👨" },
    type: "custom",
  },
  {
    id: "3",
    position: { x: 0, y: 300 },
    data: { name: "Business Development", emoji: "👩" },
    type: "custom",
  },
  {
    id: "4",
    position: { x: 400, y: 300 },
    data: { name: "Planning Analyst", emoji: "👩" },
    type: "custom",
  },
  {
    id: "5",
    position: { x: -800, y: 600 },
    data: { name: "Sales", emoji: "👩" },
    type: "custom",
  },
  {
    id: "6",
    position: { x: 0, y: 600 },
    data: { name: "Sales", emoji: "👩" },
    type: "custom",
  },
];

export const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "step" },
  { id: "e1-3", source: "1", target: "3", type: "step" },
  { id: "e1-4", source: "1", target: "4", type: "step" },
  { id: "e2-5", source: "2", target: "5", type: "step" },
  { id: "e2-6", source: "2", target: "6", type: "step" },
];
