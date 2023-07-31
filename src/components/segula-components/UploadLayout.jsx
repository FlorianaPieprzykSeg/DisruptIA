import PropTypes from 'prop-types';
// ----------------------------------------------------------------------

import { Badge, Box, Button, FormControl, FormLabel } from "@mui/material";
import Iconify from "../iconify/Iconify";
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';

UploadLayout.propTypes = {
  handleOpenUploadFile: PropTypes.func,
  handleOpenUploadURL: PropTypes.func,
};

export default function UploadLayout({isEdit, handleOpenUploadFile, field, countDoc = 0, documents, documentsWithoutId, boxWidth = '100%', error, disabled, justTheField = false, title, isAttachement = false, inTab = false}) {
  const [countDocWithDocuments, setCountDocWithDocuments] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    documents = (isEdit)?documents:(documents && documents.documentsToAdd)?JSON.parse(documents.documentsToAdd):[]
    let countDocValue = 0;
    if(documentsWithoutId) {
      documentsWithoutId.map((doc) => {
        if((field && (field == doc.field)) || !field) { 
          countDocValue += 1;
        }
      });
    }
    if(documents) {
      documents.map((doc) => {
        if((field && (field == doc.linkedEntityField || field == doc.field)) || !field) { 
          countDocValue += 1;
        }
      });
      setCountDocWithDocuments(countDocValue);
    } else {
      setCountDocWithDocuments(countDoc);
    }
  }, [documents, documentsWithoutId]);


  return (
    <Box>
    {isAttachement ? (
      <Button 
          variant="outlined" 
          sx={{
              height: '55px', 
              backgroundColor:theme.palette.background.paper, 
              color:theme.palette.info.dark,
              borderColor:theme.palette.info.dark,
              '&:hover': {
                  backgroundColor:theme.palette.info.lighter, 
                  color:theme.palette.info.dark,
                  borderColor:theme.palette.info.dark,
              },
          }}
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenUploadFile}
        >
            Documents
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
          <Badge badgeContent={countDocWithDocuments} color="error" sx={{ width: '100%', marginTop: 1 }}>
            {title ? (
              <Button sx={{ height: '55px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                fullWidth={true}
                variant="outlined"
                endIcon={<Iconify icon="eva:upload-fill" />}
                onClick={handleOpenUploadFile}
                disabled={disabled}
              >
                {title}
              </Button>
            ) : (
              <Button sx={{ height: '55px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                fullWidth={true}
                variant="outlined"
                endIcon={<Iconify icon="eva:upload-fill" />}
                onClick={handleOpenUploadFile}
                disabled={disabled}
              >
                Documents
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
              Documents
            </FormLabel>
            <Badge badgeContent={countDocWithDocuments} color="error" sx={{ width: '100%' }}>
              {title ? (
                <Button sx={{ height: '50px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                  fullWidth={true}
                  variant="outlined"
                  endIcon={<Iconify icon="eva:upload-fill" />}
                  onClick={handleOpenUploadFile}
                  disabled={disabled}
                >
                  {title}
                </Button>
              ) : (
                <Button sx={{ height: '50px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                  fullWidth={true}
                  variant="outlined"
                  endIcon={<Iconify icon="eva:upload-fill" />}
                  onClick={handleOpenUploadFile}
                  disabled={disabled}
                >
                  Documents
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

