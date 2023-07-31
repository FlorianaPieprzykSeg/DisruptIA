import PropTypes from 'prop-types';
// ----------------------------------------------------------------------

import {Checkbox, Dialog, DialogTitle, List, ListItem, ListItemText } from "@mui/material";
import i18next from 'i18next';

DialogColumns.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    handleColumnVisibilityChange: PropTypes.func,
};

export default function DialogColumns({open, onClose, columns, columnVisibility, handleColumnVisibilityChange, ...other}) {

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" {...other}>
        <DialogTitle>{i18next.t('columnsVisibility')} :</DialogTitle>
        <List>
        {columns.map((column) => {
            if(column.id != 'actions') {
            return(
                <ListItem key={column.label}>
                    <ListItemText children={column.label} />
                    <Checkbox
                        name={column.id}
                        checked={columnVisibility[column.id]}
                        onChange={handleColumnVisibilityChange}
                    />
                </ListItem>
            );
            }
        })}
        </List>
  </Dialog>
  );
}

