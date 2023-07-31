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
import i18next from 'i18next';
// components

// ----------------------------------------------------------------------

export default function OnlyComViewDialog({
  title = 'View Comment',
  id,
  open,
  onClose,
  comment,
  ...other
}) {

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <TextField
              sx={{ marginY: 0.2, width: '100%' }}
              label="Comment"
              multiline
              rows={4}
              value={comment}
              disabled
          />
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="eva:close-fill" />}
          onClick={() => {
            onClose();
          }}
          sx={{ backgroundColor: 'background.neutral'}}
        >
          Close
        </Button>
      </DialogActions>
  
    </Dialog>
  );
}
