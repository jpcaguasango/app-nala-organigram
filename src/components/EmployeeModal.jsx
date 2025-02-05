import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import { useState } from 'react';

const EmployeeModal = ({
  nodeId,
  open,
  handleClose,
  employees,
  addEmployee,
  editEmployee,
  deleteEmployee,
}) => {
  const [employeeIndex, setEmployeeIndex] = useState(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');

  const handleSave = () => {
    if (employeeIndex !== null) {
      editEmployee(nodeId, employeeIndex, { name, position });
    } else {
      addEmployee(nodeId, { name, position });
    }

    setName('');
    setPosition('');
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Add Employee
        </Typography>

        <Grid container spacing={2} sx={{ padding: '20px 0' }}>
          <Grid size={5}>
            <TextField
              label="Name"
              fullWidth
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid size={5}>
            <TextField
              label="Position"
              fullWidth
              size="small"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </Grid>
          <Grid size={2} display="flex" justifyContent="end">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSave}
            >
              Save
            </Button>
          </Grid>
        </Grid>

        <div style={{ marginTop: 20 }}>
          <Typography variant="h6" component="h2">
            Employees
          </Typography>

          <Table
            sx={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              marginTop: 2,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Position</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{employee.name}</TableCell>
                  <TableCell align="center">{employee.position}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => {
                        setEmployeeIndex(index);
                        setName(employee.name);
                        setPosition(employee.position);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => deleteEmployee(nodeId, index)}
                      style={{ marginLeft: 8 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Box>
    </Modal>
  );
};

EmployeeModal.propTypes = {
  nodeId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  employees: PropTypes.array.isRequired,
  addEmployee: PropTypes.func.isRequired,
  editEmployee: PropTypes.func.isRequired,
  deleteEmployee: PropTypes.func.isRequired,
};

export default EmployeeModal;
