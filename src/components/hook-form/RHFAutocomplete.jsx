import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, TextField, useTheme } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  setValueSelected: PropTypes.func,
};


/*
Component that can take options with the format : 
- const options = ["Option1","Option2"]
- const options = [{label:"Option1",value:1},{label:"Option2",value:2}]

In the case of an options composed of object, the autocomplete returns the value of the selected object to the form onSubmit.
To indicate which format you are entering, use the shouldGetId prop
*/
export default function RHFAutocomplete({ name, label, options, shouldGetId, getOptionLabel, isOptionEqualToValue, helperText, setValueSelected, disabled, ...other }) {
  const { control } = useFormContext();

  const getValueFromOptions = (value) => {
    return options.find((option) => option.value === value) ?? null;
  };
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          disabled={disabled}
          id="combo-box-demo"
          options={options}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          onChange={
            (shouldGetId)
            ?(event, value) => {
              if(value) { 
                if(setValueSelected){
                  setValueSelected(value.value);
                }
                return onChange(value.value);
              } else { 
                if(setValueSelected){
                  setValueSelected(null);
                }
                return onChange(null);
              }
            }
            :(event, value) => {
              if(setValueSelected){
                setValueSelected(value);
              }
              return onChange(value);
            }
          }
          value={(shouldGetId)?getValueFromOptions(value):(value || '')}
          renderInput={(params) =>
            <TextField
              {...params}
              sx={{
                backgroundColor: disabled ? theme.palette.action.disabledBackground : 'transparent', // Set the grey background color
                borderRadius: disabled ? 1 : 0
              }}
              label={label}
              fullWidth
              error={error || null}
              helperText={error ? error?.message : helperText}
              {...other}
            />
          }
        />
      )}
    />
  );
}
