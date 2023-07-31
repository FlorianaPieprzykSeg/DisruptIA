import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// @mui
import {
  Stack,
  Dialog,
  Box,
  Button,
  CircularProgress,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from '@mui/material';
import Iconify from '../iconify/Iconify';
// components

// ----------------------------------------------------------------------

export default function EditIncidentDialog({
  title = 'Edit Incident',
  id,
  open,
  onClose,
  incident,
  updateIncident,
  ...other
}) {

    const [newIncident, setNewIncident] = useState(incident);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <TextField
            sx={{ marginY: 0.2, width: '100%' }}
            label="Incident"
            multiline
            rows={2}
            maxRows={4}
            value={newIncident}
            onChange={(e) => setNewIncident(e.target.value)}
        />
        
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="eva:close-fill" />}
          onClick={() => {
            updateIncident(id, newIncident);
            onClose();
          }}
          sx={{ backgroundColor: 'background.neutral'}}
        >
          Save and Close
        </Button>
      </DialogActions>
  
    </Dialog>
  );
}
