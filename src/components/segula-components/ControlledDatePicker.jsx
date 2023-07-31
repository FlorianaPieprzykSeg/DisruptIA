import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Controller, useFormContext } from "react-hook-form";

const ControlledDatePicker = ({ name, label, value, onChange, disabled, isValidated = false}) => {
    const { control } = useFormContext();
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={value}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label={label}
            onChange={onChange}
            {...field}
            value={value}
            slotProps={{
                textField: {
                  variant: 'outlined',
                  error: !!error,
                  helperText: error?.message,
                  disabled:disabled,
                  sx: {
                    backgroundColor: (disabled)?'rgba(211, 211, 211, 0.5)':'transparent', // Set the grey background color
                    borderRadius: (disabled)?1:0,
                    marginTop: (isValidated)?5:0, 
                    maxWidth: (isValidated)?'35%':'100%',
                  }
                },
            }}
            disabled={disabled}
          />
        )}
      />
    );
  };
  
  export default ControlledDatePicker;