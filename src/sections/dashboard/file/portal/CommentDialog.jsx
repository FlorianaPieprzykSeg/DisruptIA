import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// @mui
import {
  Stack,
  Dialog,
  Box,
  Button,
  CircularProgress,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Divider,
} from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { Upload } from '../../../../components/upload';

//Post files
import Axios from '../../../../_services/caller.service';
import { RHFAutocomplete } from '../../../../components/hook-form';
import EntityCommentList from '../../../general/comments/EntityCommentList';
import i18next from 'i18next';

// ----------------------------------------------------------------------

const maxTextUrlLength = 40;

CommentDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onUploadSuccess: PropTypes.func,
};

export default function CommentDialog({
  title = 'Upload Files',
  open,
  onClose,
  //
  isCreate = false,
  onCreate,
  onUpdate,
  //
  folderName,
  entity,
  field,
  fields,
  commentsToAdd,
  commentsToShow,
  commentsToDel,
  setCommentInfo,
  onChangeFolderName,
  onCommentSuccess,
  onDeleteComment,
  updateComment,
  ...other
}) {
  const [uploading, setUploading] = useState(false);
  const [textComment, setTextComment] = useState('');
  const [comments, setComments] = useState([]);

  const [fieldEntered, setFieldEntered] = useState((fields != null && fields != [])?fields[0]:'');

  useEffect(() => {
    setFieldEntered((fields != null && fields != [])?fields[0]:'');
  },[field, fields])

  useEffect(() => {
    if (!open) {
      setComments([]);
    }
  }, [open]);

  const handleUpload = () => {
    setUploading(true);
    if(textComment != null && textComment != '') {
        let comment = {
            linkedEntityModel: entity,
            linkedEntityField: (field)?field:fieldEntered,
            comment: textComment
        }
        const newComments = (commentsToAdd && commentsToAdd.commentsToAdd)?JSON.parse(commentsToAdd.commentsToAdd).concat([comment]):[comment];
        setCommentInfo(JSON.stringify(newComments), onCommentSuccess);
        setUploading(false);
        setFieldEntered((fields != null && fields != [])?fields[0]:'');
        setTextComment('');
        onClose();
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      {/* Add an overlay and a CircularProgress when uploading is in progress */}
      {uploading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
        >
          <CircularProgress />

        </Box>
      )}
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(fields != null && fields != [] && (
          <Autocomplete
          id="combo-box-demo"
          options={fields}
          getOptionLabel={(opt) => (opt == 'END')?i18next.t('VALIDATION'):(i18next.t(opt))}
          onChange={(e, value) => {setFieldEntered(value)}}
          renderInput={(params) =>
            <TextField
              {...params}
              label={'Field Linked'}
              sx={{ maxWidth: '45%', marginBottom: '5px'}}
            />
          }
          defaultValue={fields[0]}
        />
        ))}
        <TextField
            sx={{ marginY: 0.2, width: '100%' }}
            label="Comment"
            placeholder='Comment...'
            multiline
            rows={2}
            maxRows={4}
            value={textComment}
            onChange={(e) => setTextComment(e.target.value)}
        />

        {(textComment != '' && textComment != null) && (
          <Button
            variant="contained"
            onClick={handleUpload}
            sx={{ marginTop: '10px', marginRight: '5px' }}
          >
            Save
          </Button>
        )}

        {isCreate ? (
          (commentsToAdd && commentsToAdd.commentsToAdd) && (
            <EntityCommentList isCreate={true} comments={JSON.parse(commentsToAdd.commentsToAdd)} field={(field) ? field : fieldEntered} fullWith onDeleteComment={onDeleteComment} updateComment={updateComment}></EntityCommentList>
          )
        ) : (
          commentsToAdd && commentsToShow && (
            commentsToAdd.commentsToAdd ? (
              <EntityCommentList isEdit={true} comments={commentsToShow} commentsWithoutId={commentsToAdd} field={(field) ? field : fieldEntered} fullWith onDeleteComment={onDeleteComment} updateComment={updateComment}></EntityCommentList>
            ) : (
              <EntityCommentList isEdit={true} comments={commentsToShow} field={(field)?field:fieldEntered} fullWith onDeleteComment={onDeleteComment} updateComment={updateComment}></EntityCommentList>
            )
          )
        )}
        
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="eva:close-fill" />}
          onClick={onClose}
          sx={{ backgroundColor: 'background.neutral'}}
        >
          Close
        </Button>
      </DialogActions>
  
    </Dialog>
  );
}
