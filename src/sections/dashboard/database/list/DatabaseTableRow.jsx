import PropTypes from 'prop-types';
import { useState } from 'react';
import { fDate, fDateTime } from '../../../../utils/formatTime';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import i18next from 'i18next';
import { CustomAvatar } from '../../../../components/custom-avatar';
import { Box } from '@mui/system';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

DatabaseTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function DatabaseTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow,selectedColumns}) {
  const { id, lib, customer, sector, cat, result, referent, createdAt, updatedAt } = row;

  const handleOpenUrl = (docUrl) => {
    window.open(docUrl, "_blank");
  }

  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox sx={{ color: 'primary.main' }} checked={selected} onClick={onSelectRow} />
        </TableCell>
        {selectedColumns.id &&
          <TableCell>
            {id}
          </TableCell>
        }
        {selectedColumns.lib &&
          <TableCell>
            <Typography 
              sx={{
                fontWeight:'bold',
                ":hover" : {
                  textDecoration: 'underline',
                  cursor: 'pointer'
                },
              }}
              onClick={() => enqueueSnackbar('Vous ne pouvez pas editer les élèments', { variant: 'error' })}
            >
              {lib}
            </Typography>
          </TableCell>
        }
        {selectedColumns.customer &&
          <TableCell>
            {customer}
          </TableCell>
        }
        {selectedColumns.sector &&
          <TableCell>
            {sector}
          </TableCell>
        }
        {selectedColumns.cat &&
          <TableCell>
            {cat}
          </TableCell>
        }
        {selectedColumns.result &&
          <TableCell>
            <Label color={(result == "Gagné")?'success':'error'}>
            {result}
            </Label>
          </TableCell>
        }
        {selectedColumns.referent &&
          <TableCell>
            {referent}
          </TableCell>
        }
        {selectedColumns.createdAt &&

          <TableCell>
            {createdAt}
          </TableCell>
        }
        {selectedColumns.updatedAt &&

          <TableCell>
            {updatedAt}
          </TableCell>
        }
      </TableRow>
    </>
  );
}
