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
import EntityDocumentList from '../../../general/documents/testWorkflowDocumentTabPanel/EntityDocumentList';
import { RHFAutocomplete } from '../../../../components/hook-form';
import i18next from 'i18next';

// ----------------------------------------------------------------------

const maxTextUrlLength = 40;

FileNewFolderDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onUploadSuccess: PropTypes.func,
};

export default function FileNewFolderDialog({
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
  documentsToAdd,
  documentsToShow,
  documentsToShowNew,
  documentsToDel,
  setUploaderInfo,
  onChangeFolderName,
  onUploadSuccess,
  onDeleteDocument,
  ...other
}) {
  const [textURL, setTextURL] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [fieldEntered, setFieldEntered] = useState((fields != null && fields != [])?fields[0]:'');

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  const handleUpload = () => {
    setUploading(true);
    if(!!files.length) {
      let formData = new FormData();
      for (const element of files) {
        formData.append("filedata", element);
      }

      Axios.post(`/api/upload/${entity}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if(field) {
          res.data.map((doc) => {
            doc.field = field
            doc.linkedEntityField = field;
          });
        } else {
          if(fieldEntered) {
            res.data.map((doc) => {
              doc.field = fieldEntered;
              doc.linkedEntityField = fieldEntered;
            });
          }
        }
        const newDocuments = (documentsToAdd && documentsToAdd.documentsToAdd)?JSON.parse(documentsToAdd.documentsToAdd).concat(res.data):res.data;
        setUploaderInfo(JSON.stringify(newDocuments), onUploadSuccess);

        //Management of the text Url
        if(textURL != '' && textURL != null) {
          const docUrlName = textURL.length > maxTextUrlLength
          ? textURL.slice(0, maxTextUrlLength - 3) + '...'
          : textURL;
          const newUrl = [{
            docKey:"",
            docOriginalname:docUrlName,
            docFilename:"",
            docSize:0,
            docMimetype:"application/url",
            docUrl:textURL, 
            field:(field)?field:fieldEntered,
            linkedEntityField:(field)?field:fieldEntered,
          }];
          const newDocuments = (documentsToAdd && documentsToAdd.documentsToAdd)?JSON.parse(documentsToAdd.documentsToAdd).concat(newUrl):newUrl;
          setUploaderInfo(JSON.stringify(newDocuments));
        }

        setUploading(false);
        setFieldEntered((fields != null && fields != [])?fields[0]:'');
        setTextURL('');
        onClose();
      }).catch((err) => { 
        console.log('uploader err' + err); 
        setUploading(false); 
      });
    } else {
      //Management of the text Url
      if(textURL != '' && textURL != null) {
        const docUrlName = textURL.length > maxTextUrlLength
        ? textURL.slice(0, maxTextUrlLength - 3) + '...'
        : textURL;
        const newUrl = [{
          docKey:"",
          docOriginalname:docUrlName,
          docFilename:"",
          docSize:0,
          docMimetype:"application/url",
          docUrl:textURL, 
          field:(field)?field:fieldEntered,
          linkedEntityField:(field)?field:fieldEntered,
        }];
        const newDocuments = (documentsToAdd && documentsToAdd.documentsToAdd)?JSON.parse(documentsToAdd.documentsToAdd).concat(newUrl):newUrl;
        setUploaderInfo(JSON.stringify(newDocuments));
        setUploading(false);
        setTextURL('');
        onClose();
      }
    }
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
    setTextURL('');
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
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}
        {((fields != null && fields != []) && (
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
        <Box
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: '45% 3.8% 45%',
          }}
        >
          <Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
          <p style={{justifySelf:'center'}}>Or</p>
          <TextField
            sx={{ marginY: 0.2 }}
            label="Text URL"
            value={textURL}
            onChange={(e) => setTextURL(e.target.value)}
          />
        </Box>

        {(!!files.length || (textURL != '' && textURL != null)) && (
          <><Button
            variant="contained"
            onClick={handleUpload}
            sx={{ marginTop: '10px', marginRight: '5px' }}
          >
            Save
          </Button><Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles} sx={{ marginTop: '10px' }}>
              Remove all
            </Button></>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}

        {isCreate ? (
          (documentsToAdd && documentsToAdd.documentsToAdd) && (
            <EntityDocumentList isCreate={true} documents={JSON.parse(documentsToAdd.documentsToAdd)} field={(field) ? field : fieldEntered} fullWith onDeleteDocument={onDeleteDocument}></EntityDocumentList>
          )
        ) : (
          documentsToAdd && documentsToShow && (
            documentsToAdd.documentsToAdd ? (
              <EntityDocumentList isEdit={true} documents={documentsToShow} documentsWithoutId={documentsToAdd} field={(field) ? field : fieldEntered} fullWith onDeleteDocument={onDeleteDocument}></EntityDocumentList>
            ) : (
              <EntityDocumentList isEdit={true} documents={documentsToShow} field={(field)?field:fieldEntered} fullWith onDeleteDocument={onDeleteDocument}></EntityDocumentList>
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
