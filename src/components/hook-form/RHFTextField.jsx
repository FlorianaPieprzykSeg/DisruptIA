import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFTextField({ name, helperText, errorBack, onChange, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={field.value || ''}
          onChange={(e) => {
            console.log("HERE");
            field.onChange(e);
            if (onChange) {
              console.log(e);
              onChange(e);
            }
          }}
          error={!!error || !!errorBack}
          helperText={error ? error?.message : helperText}
          inputProps={{
            autoComplete: 'new-password'
          }}
          {...other}
        />
      )}
    />
  );
}
