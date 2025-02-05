import CachedIcon from '@mui/icons-material/Cached';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';

const TiersAndNodes = ({
  tiers,
  nodes,
  addTier,
  addNode,
  editTier,
  onReset,
}) => {
  const [editingTier, setEditingTier] = useState(null);

  return (
    <div
      style={{
        flex: 1,
        padding: '20px',
        borderLeft: '1px solid #ccc',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            display: 'block',
            fontWeight: 'bold',
          }}
          gutterBottom
        >
          Tiers & Nodes
        </Typography>

        <Button
          variant="contained"
          size="small"
          startIcon={<CachedIcon />}
          onClick={onReset}
        >
          Reset
        </Button>
      </div>

      {tiers.map((tier, index) => (
        <Card key={index} sx={{ marginBottom: '20px' }}>
          <CardContent>
            {editingTier === index ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  value={tier.data.label}
                  onChange={(e) => editTier(index, e.target.value)}
                />

                <Button
                  variant="contained"
                  size="small"
                  endIcon={<SendIcon />}
                  onClick={() => setEditingTier(null)}
                >
                  Done
                </Button>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: 'block',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                  gutterBottom
                >
                  {tier.data.label}
                </Typography>

                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => setEditingTier(index)}
                >
                  <EditIcon />
                </IconButton>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                margin: '10px 0',
              }}
            >
              {nodes
                .filter((node) => node.tier === tier.id)
                .map((node) => (
                  <Chip
                    key={node.id}
                    label={node.data.label}
                    style={{ margin: '5px' }}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
            </div>

            <CardActions>
              <Button
                variant="contained"
                size="small"
                onClick={() => addNode(index)}
              >
                Add Node
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      ))}

      <Button variant="contained" size="small" fullWidth onClick={addTier}>
        Add Tier
      </Button>
    </div>
  );
};

TiersAndNodes.propTypes = {
  tiers: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  addTier: PropTypes.func.isRequired,
  addNode: PropTypes.func.isRequired,
  editTier: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default TiersAndNodes;
