import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import i18next from 'i18next';

// ----------------------------------------------------------------------

UserTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterSearch: PropTypes.string,
  filterRole: PropTypes.string,
  onfilterSearch: PropTypes.func,
  onFilterRole: PropTypes.func,
  onResetFilter: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.string),
};

export default function UserTableToolbar({
  isFiltered,
  filterSearch,
  filterRole,
  optionsRole,
  onfilterSearch,
  onFilterRole,
  onResetFilter,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="left"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >

      <TextField
        fullWidth
        select
        label={i18next.t('cat')}
        value={filterRole}
        onChange={onFilterRole}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,                
              },
            },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
        }}
      >
        {optionsRole.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',              
            }}
          >
            {i18next.t(option)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filterSearch}
        onChange={onfilterSearch}
        placeholder={i18next.t('search')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}
