import PropTypes from 'prop-types';
// ----------------------------------------------------------------------

import { Badge, Box, Button, FormControl, FormLabel } from "@mui/material";
import Iconify from "../iconify/Iconify";
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';

ExemptLayout.propTypes = {
  handleOpenUploadFile: PropTypes.func,
  handleOpenUploadURL: PropTypes.func,
};

export default function ExemptLayout({isEdit, handleOpenUploadExempt, field, countEx = 0, exempts, exemptsWithoutId, boxWidth = '100%', error, disabled, justTheField = false, title, isAttachement = false}) {
  const [countExWithExempts, setCountExWithExempts] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    exempts = (isEdit)?exempts:(exempts && exempts.exemptionsToAdd)?JSON.parse(exempts.exemptionsToAdd):[]
    let countExValue = 0;
    if(exemptsWithoutId) {
        exemptsWithoutId.map((exempt) => {
        if((field && (field == exempt.linkedEntityField)) || !field) { 
          countExValue += 1;
        }
      });
    }
    if(exempts) {
        exempts.map((exempt) => {
        if((field && (field == exempt.linkedEntityField || field == exempt.field)) || !field) { 
          countExValue += 1;
        }
      });
      setCountExWithExempts(countExValue);
    } else {
      setCountExWithExempts(countEx);
    }
  }, [exempts, exemptsWithoutId]);


  return (
    <Box>
        {isAttachement ? (
            <Button 
                variant="outlined" 
                sx={{
                    height: '55px', 
                    backgroundColor:theme.palette.background.paper, 
                    color:theme.palette.error.dark,
                    borderColor:theme.palette.error.dark,
                    '&:hover': {
                        backgroundColor:theme.palette.error.lighter, 
                        color:theme.palette.error.dark,
                        borderColor:theme.palette.error.dark,
                    },
                }}
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenUploadExempt}
            >
                Exempts
            </Button>
        ) : (
        <Box width={boxWidth} color='paper' marginTop={-1}>
            <Box
                display="grid"
                gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                }}
                marginBottom={0.8}
            > 
            {justTheField ? (
                <>
                <Badge badgeContent={countExWithExempts} color="error" sx={{ width: '100%', marginTop: 1 }}>
                {title ? (
                    <Button sx={{ height: '55px', backgroundColor: (!disabled)?'white':'background.neutral' }}
                    fullWidth={true}
                    variant="outlined"
                    endIcon={<Iconify icon="eva:alert-circle-outline" />}
                    onClick={handleOpenUploadExempt}
                    disabled={disabled}
                    >
                    {title}
                    </Button>
                ) : (
                    <Button sx={{ height: '55px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                    fullWidth={true}
                    variant="outlined"
                    endIcon={<Iconify icon="eva:alert-circle-outline" />}
                    onClick={handleOpenUploadExempt}
                    disabled={disabled}
                    >
                    Exempts
                    </Button>
                )}
                </Badge>
                {error && (
                <span style={{color: theme.palette.error.main, fontSize:12}}>{error}</span>
                )}
                </>
            ) : (
                <><Box component="fieldset" sx={{borderRadius: '8px', borderColor: (!error)?'background.caption':'error.main', borderWidth: '1px'}}>
                <FormLabel component="legend" sx={{ typography: 'caption' }}>
                Exempts
                </FormLabel>
                <Badge badgeContent={countExWithExempts} color="error" sx={{ width: '100%' }}>
                    {title ? (
                    <Button sx={{ height: '50px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                        fullWidth={true}
                        variant="outlined"
                        endIcon={<Iconify icon="eva:alert-circle-outline" />}
                        onClick={handleOpenUploadExempt}
                        disabled={disabled}
                    >
                        {title}
                    </Button>
                    ) : (
                    <Button sx={{ height: '50px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                        fullWidth={true}
                        variant="outlined"
                        endIcon={<Iconify icon="eva:alert-circle-outline" />}
                        onClick={handleOpenUploadExempt}
                        disabled={disabled}
                    >
                        Exempts
                    </Button>
                    )}
                </Badge>
                </Box>
                {error && (
                <span style={{color: theme.palette.error.main, fontSize:12}}>{error}</span>
                )}</>
            )}
            </Box>
        </Box>
        )}
    </Box>
  );
}

