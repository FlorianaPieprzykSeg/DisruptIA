import PropTypes from 'prop-types';
// ----------------------------------------------------------------------

import { Badge, Box, Button, FormControl, FormLabel } from "@mui/material";
import Iconify from "../iconify/Iconify";
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';

IncidentLayout.propTypes = {
  handleOpenUploadFile: PropTypes.func,
  handleOpenUploadURL: PropTypes.func,
};

export default function IncidentLayout({isEdit, handleOpenUploadIncident, field, countInc = 0, incidents, incidentsWithoutId, boxWidth = '100%', error, disabled, justTheField = false, title, isAttachement = false}) {
  const [countIncWithIncidents, setCountIncWithIncidents] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    incidents = (isEdit)?incidents:(incidents && incidents.incidentsToAdd)?JSON.parse(incidents.incidentsToAdd):[]
    let countIncValue = 0;
    if(incidentsWithoutId) {
        incidentsWithoutId.map((incident) => {
        if((field && (field == incident.linkedEntityField)) || !field) { 
          countIncValue += 1;
        }
      });
    }
    if(incidents) {
        incidents.map((incident) => {
        if((field && (field == incident.linkedEntityField || field == incident.field)) || !field) { 
          countIncValue += 1;
        }
      });
      setCountIncWithIncidents(countIncValue);
    } else {
      setCountIncWithIncidents(countInc);
    }
  }, [incidents, incidentsWithoutId]);


  return (
    <Box>
        {isAttachement ? (
            <Button 
                variant="outlined" 
                sx={{
                    height: '55px', 
                    backgroundColor:theme.palette.background.paper, 
                    color:theme.palette.warning.dark,
                    borderColor:theme.palette.warning.dark,
                    '&:hover': {
                        backgroundColor:theme.palette.warning.lighter, 
                        color:theme.palette.warning.dark,
                        borderColor:theme.palette.warning.dark,
                    },
                }}
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenUploadIncident}
            >
                Incidents
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
                <Badge badgeContent={countIncWithIncidents} color="error" sx={{ width: '100%', marginTop: 1 }}>
                {title ? (
                    <Button sx={{ height: '55px', backgroundColor: (!disabled)?'white':'background.neutral' }}
                    fullWidth={true}
                    variant="outlined"
                    endIcon={<Iconify icon="eva:calendar-outline" />}
                    onClick={handleOpenUploadIncident}
                    disabled={disabled}
                    >
                    {title}
                    </Button>
                ) : (
                    <Button sx={{ height: '55px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                    fullWidth={true}
                    variant="outlined"
                    endIcon={<Iconify icon="eva:calendar-outline" />}
                    onClick={handleOpenUploadIncident}
                    disabled={disabled}
                    >
                    Incidents
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
                Incidents
                </FormLabel>
                <Badge badgeContent={countIncWithIncidents} color="error" sx={{ width: '100%' }}>
                    {title ? (
                    <Button sx={{ height: '50px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                        fullWidth={true}
                        variant="outlined"
                        endIcon={<Iconify icon="eva:calendar-outline" />}
                        onClick={handleOpenUploadIncident}
                        disabled={disabled}
                    >
                        {title}
                    </Button>
                    ) : (
                    <Button sx={{ height: '50px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                        fullWidth={true}
                        variant="outlined"
                        endIcon={<Iconify icon="eva:calendar-outline" />}
                        onClick={handleOpenUploadIncident}
                        disabled={disabled}
                    >
                        Incidents
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

