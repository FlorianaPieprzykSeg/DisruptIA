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
  Badge,
  useTheme,
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import i18next from 'i18next';
import { CustomAvatar } from '../../../../components/custom-avatar';
import { Box } from '@mui/system';

// ----------------------------------------------------------------------

AorTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function AorTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow,selectedColumns}) {
  const { id, lib, type, customer, sector, cat, localisation, tjm, referent, referentCustomer, proba, statut, echeance, duree, createdAt, updatedAt } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenUrl = (docUrl) => {
    window.open(docUrl, "_blank");
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
              onClick={() => handleOpenUrl('/dashboard/aor/'+id+'/edit')}
            >
              {lib}
            </Typography>
          </TableCell>
        }
        {selectedColumns.type &&
          <TableCell>
            {type}
          </TableCell>
        }
        {selectedColumns.statut &&
          <TableCell>
            {statut}
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
        {selectedColumns.localisation &&
          <TableCell>
            {localisation}
          </TableCell>
        }
        {selectedColumns.skills &&
          <TableCell>
            <Badge badgeContent={3} color="primary" sx={{width: '50px'}}>
                <Button>
                  <Iconify icon="game-icons:skills" />
                </Button>
            </Badge>
          </TableCell>
        }
        {selectedColumns.tjm &&
          <TableCell>
            {tjm}€
          </TableCell>
        }
        {selectedColumns.echeance &&
          <TableCell>
            {echeance}
          </TableCell>
        }
        {selectedColumns.duree &&
          <TableCell>
            {duree}
          </TableCell>
        }
        {selectedColumns.proba &&
          <TableCell>
            <Label color={(proba >= 80)?'success':(proba < 80 && proba >= 50)?'warning':'error'}>
            {proba}
            </Label>
          </TableCell>
        }
        {selectedColumns.referent &&
          <TableCell>
            {referent}
          </TableCell>
        }
        {selectedColumns.referentCustomer &&
          <TableCell>
            {referentCustomer}
          </TableCell>
        }
        {selectedColumns.docs &&
          <TableCell>
            <Badge badgeContent={1} color="primary" sx={{width: '50px'}}>
                <Button>
                  <Iconify icon="material-symbols:attach-file" />
                </Button>
            </Badge>
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

        <TableCell 
          sx={{
            position: "sticky",
            right: 0,
            zIndex: 1,
            background: theme.palette.background.paper
          }}
        >
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" color='primary.main' />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          {i18next.t('edit')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          {i18next.t('delete')}
        </MenuItem>


      </MenuPopover>

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
