import { DatePicker } from "@mui/x-date-pickers";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

  
function FormDatePicker({name, label, onChangeFunc, value, disabled, sx}) {

    const { control } = useFormContext();
    return (
        <Controller
        name={name}
        control={control}
        defaultValue={value}
        render={({ field: { onChange }, fieldState: { error } }) => (
            <DatePicker
              label={label}
              value={value}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  error: !!error,
                  helperText: error?.message,
                  disabled:disabled,
                  sx: sx
                },
              }}
              onChange={(event) => { 
                onChange(event);
                if(onChangeFunc) {
                    onChangeFunc(event); 
                }
              }}
              disabled={disabled}
            />
        )}
      />
    );
  }
  
  export default FormDatePicker;