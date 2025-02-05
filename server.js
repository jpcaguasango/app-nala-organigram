import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = 3001;
const DATA_FILE = 'data.json';

app.use(express.json());
app.use(cors());

// Default data structure
const defaultData = {
  tiers: [],
  nodes: [],
  edges: [],
};

// Load initial data or create file if it doesn't exist
const loadData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Get all data (tiers, nodes, edges)
app.get('/data', (req, res) => {
  const data = loadData();
  res.json(data);
});

// Save or update the entire structure
app.post('/save', (req, res) => {
  const { tiers, nodes, edges } = req.body;
  if (!tiers || !nodes || !edges) {
    return res.status(400).json({ error: 'Invalid data format' });
  }
  const newData = { tiers, nodes, edges };
  saveData(newData);
  res.json({ message: 'Data saved successfully' });
});

// Reset data to default
app.get('/reset', (req, res) => {
  saveData(defaultData);
  res.json({ message: 'Data reset to default' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
