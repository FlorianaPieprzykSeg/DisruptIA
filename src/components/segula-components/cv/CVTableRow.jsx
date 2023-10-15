import PropTypes from 'prop-types';
import { useState } from 'react';
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
  Badge,
  useTheme,
} from '@mui/material';
// components
import i18next from 'i18next';
import Iconify from '../../iconify/Iconify';
import ConfirmDialog from '../../confirm-dialog/ConfirmDialog';
import FileSaver from 'file-saver';

// ----------------------------------------------------------------------

AorTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function AorTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow,selectedColumns, setIsProfilSelected}) {
  const { id, firstName, lastName, lien, localisation} = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleDownloadDocument = () => {
    FileSaver.saveAs('/cv/DossierCompétences_JDU.pdf', 'DossierCompétence_JDU');
  }

  const theme = useTheme();

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
        {selectedColumns.firstName &&
          <TableCell>
            {firstName}
          </TableCell>
        }
        {selectedColumns.lastName &&
          <TableCell>
            {lastName}
          </TableCell>
        }
        {selectedColumns.lien &&
          <TableCell>
            {lien}
          </TableCell>
        }
        {selectedColumns.localisation &&
          <TableCell>
            {localisation}
          </TableCell>
        }

        <TableCell 
          sx={{
            position: "sticky",
            right: 0,
            zIndex: 1,
            background: theme.palette.background.paper
          }}
        >
          <IconButton color={'default'} onClick={() => {setIsProfilSelected(true); handleDownloadDocument();}}>
            <Iconify icon="eva:checkmark-circle-2-outline" color={theme.palette.success.main} />
          </IconButton>
          <IconButton color={'default'} onClick={handleOpenConfirm}>
            <Iconify icon="eva:trash-2-outline" color={theme.palette.error.main} />
          </IconButton>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={i18next.t('delete')}
        content={i18next.t('deleteConfirm')}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {i18next.t('delete')}
          </Button>
        }
      />
    </>
  );
}
