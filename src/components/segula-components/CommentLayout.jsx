import PropTypes from 'prop-types';
// ----------------------------------------------------------------------

import { Badge, Box, Button, FormControl, FormLabel } from "@mui/material";
import Iconify from "../iconify/Iconify";
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';

CommentLayout.propTypes = {
  handleOpenUploadFile: PropTypes.func,
  handleOpenUploadURL: PropTypes.func,
};

export default function CommentLayout({isEdit, handleOpenUploadComment, field, countCom = 0, comments, commentsWithoutId, boxWidth = '100%', error, disabled, justTheField = false, title, isAttachement = false}) {
  const [countComWithComments, setCountComWithComments] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    comments = (isEdit)?comments:(comments && comments.commentsToAdd)?JSON.parse(comments.commentsToAdd):[]
    let countComValue = 0;
    if(commentsWithoutId) {
        commentsWithoutId.map((com) => {
        if((field && (field == com.linkedEntityField)) || !field) { 
          countComValue += 1;
        }
      });
    }
    if(comments) {
        comments.map((com) => {
        if((field && (field == com.linkedEntityField || field == com.field)) || !field) { 
          countComValue += 1;
        }
      });
      setCountComWithComments(countComValue);
    } else {
      setCountComWithComments(countCom);
    }
  }, [comments, commentsWithoutId]);


  return (
    <Box>
        {isAttachement ? (
            <Button 
                variant="outlined" 
                sx={{
                    height: '55px', 
                    backgroundColor:theme.palette.background.paper, 
                    color:theme.palette.success.dark,
                    borderColor:theme.palette.success.dark,
                    '&:hover': {
                        backgroundColor:theme.palette.success.lighter, 
                        color:theme.palette.success.dark,
                        borderColor:theme.palette.success.dark,
                    },
                }}
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenUploadComment}
            >
                Comments
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
                <Badge badgeContent={countComWithComments} color="error" sx={{ width: '100%', marginTop: 1 }}>
                {title ? (
                    <Button sx={{ height: '55px', backgroundColor: (!disabled)?'white':'background.neutral' }}
                    fullWidth={true}
                    variant="outlined"
                    endIcon={<Iconify icon="eva:message-square-outline" />}
                    onClick={handleOpenUploadComment}
                    disabled={disabled}
                    >
                    {title}
                    </Button>
                ) : (
                    <Button sx={{ height: '55px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                    fullWidth={true}
                    variant="outlined"
                    endIcon={<Iconify icon="eva:message-square-outline" />}
                    onClick={handleOpenUploadComment}
                    disabled={disabled}
                    >
                    Comments
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
                Comments
                </FormLabel>
                <Badge badgeContent={countComWithComments} color="error" sx={{ width: '100%' }}>
                    {title ? (
                    <Button sx={{ height: '50px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                        fullWidth={true}
                        variant="outlined"
                        endIcon={<Iconify icon="eva:message-square-outline" />}
                        onClick={handleOpenUploadComment}
                        disabled={disabled}
                    >
                        {title}
                    </Button>
                    ) : (
                    <Button sx={{ height: '50px', backgroundColor: (!disabled)?'white':'background.neutral'}}
                        fullWidth={true}
                        variant="outlined"
                        endIcon={<Iconify icon="eva:message-square-outline" />}
                        onClick={handleOpenUploadComment}
                        disabled={disabled}
                    >
                        Comments
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

