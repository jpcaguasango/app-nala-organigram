import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Handle, Position } from '@xyflow/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import EmployeeModal from './EmployeeModal';

const CustomNode = ({ data }) => {
  const [editingNode, setEditingNode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div>
      <Card sx={{ width: 220 }} elevation={10}>
        <CardContent>
          <Box>
            <Grid container spacing={2}>
              <Grid
                size={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Avatar />
              </Grid>
              <Grid
                size={12}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                {editingNode === data.id ? (
                  <TextField
                    variant="outlined"
                    size="small"
                    value={data.label}
                    onChange={(e) => data.editNode(data.id, e.target.value)}
                    onBlur={() => setEditingNode(null)}
                    autoFocus
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body1" align="center">
                      {data.label}
                    </Typography>

                    <IconButton
                      sx={{ marginTop: '10px' }}
                      color="primary"
                      size="small"
                      onClick={() => setEditingNode(data.id)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </Grid>
              <Grid
                size={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Chip
                  icon={<PeopleIcon style={{ marginLeft: 10 }} fontSize="12" />}
                  label={`Employees (${data.employees.length})`}
                  color="primary"
                  variant="outlined"
                  onClick={handleOpenModal}
                />
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center" mt={1}>
            <IconButton
              style={{ position: 'absolute', bottom: -75 }}
              color="primary"
              size="large"
              onClick={() => data.addNode(data.id)}
            >
              <AddCircleIcon style={{ fontSize: 48 }} />
            </IconButton>
          </Box>
          {!data.isParent && <Handle type="target" position={Position.Top} />}
          <Handle type="source" position={Position.Bottom} />
        </CardContent>
      </Card>
      <EmployeeModal
        nodeId={data.id}
        open={modalOpen}
        handleClose={handleCloseModal}
        employees={data.employees}
        addEmployee={data.addEmployee}
        editEmployee={data.editEmployee}
        deleteEmployee={data.deleteEmployee}
      />
    </div>
  );
};

CustomNode.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    isParent: PropTypes.bool,
    employees: PropTypes.array,
    editNode: PropTypes.func,
    addEmployee: PropTypes.func,
    editEmployee: PropTypes.func,
    deleteEmployee: PropTypes.func,
    addNode: PropTypes.func,
  }).isRequired,
};

export default memo(CustomNode);
