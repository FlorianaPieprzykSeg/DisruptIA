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
import EntityExemptList from '../../../general/exempts/EntityExemptList';
import i18next from 'i18next';

// ----------------------------------------------------------------------

const maxTextUrlLength = 40;

ExemptDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onUploadSuccess: PropTypes.func,
};

export default function ExemptDialog({
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
  exemptionsToAdd,
  exemptionsToShow,
  exemptionsToDel,
  setExemptInfo,
  onChangeFolderName,
  onExemptSuccess,
  onDeleteExempt,
  updateExempt,
  documentsToAdd,
  documentsToShow,
  documentsToDel,
  setUploaderInfo,
  onUploadSuccess,
  ...other
}) {
  const [uploading, setUploading] = useState(false);
  const [textExempt, setTextExempt] = useState('');
  const [files, setFiles] = useState([]);
  const [textURL, setTextURL] = useState('');

  const [fieldEntered, setFieldEntered] = useState((fields != null && fields != [])?fields[0]:'');

  useEffect(() => {
    setFieldEntered((fields != null && fields != [])?fields[0]:'');
  },[field, fields]);

  const handleUpload = () => {
    setUploading(true);
    //exempt management
    if(textExempt != null && textExempt != '') {
        let exempt = {
            linkedEntityModel: entity,
            linkedEntityField: (field)?field:fieldEntered,
            comment: textExempt
        }
        const newExempts = (exemptionsToAdd && exemptionsToAdd.exemptionsToAdd)?JSON.parse(exemptionsToAdd.exemptionsToAdd).concat([exempt]):[exempt];
        setExemptInfo(JSON.stringify(newExempts), onExemptSuccess);

        //doc management
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
              res.data.map((doc) => (doc.field = field));
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
          }
        }   
        setUploading(false);
        setFieldEntered((fields != null && fields != [])?fields[0]:'');
        setTextExempt('');
        setTextURL('');
        onClose();
    }
  };

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
            label="Exempt"
            multiline
            rows={2}
            maxRows={4}
            value={textExempt}
            onChange={(e) => setTextExempt(e.target.value)}
        />

        <Box
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: '47% 2.3% 47%',
          }}
          marginTop={0.7}
        >
          <Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
          <p style={{justifySelf:'center'}}>Or</p>
          <TextField
            label="Text URL"
            value={textURL}
            onChange={(e) => setTextURL(e.target.value)}
          />
        </Box>

        {(textExempt != '' && textExempt != null) && (
          <Button
            variant="contained"
            onClick={handleUpload}
            sx={{ marginTop: '10px', marginRight: '5px' }}
          >
            Save
          </Button>
        )}

        {isCreate ? (
          (exemptionsToAdd && exemptionsToAdd.exemptionsToAdd) && (
            <EntityExemptList isCreate={true} exempts={JSON.parse(exemptionsToAdd.exemptionsToAdd)} field={(field) ? field : fieldEntered} fullWith onDeleteExempt={onDeleteExempt} updateExempt={updateExempt}></EntityExemptList>
          )
        ) : (
          exemptionsToAdd && exemptionsToShow && (
            exemptionsToAdd.exemptionsToAdd ? (
              <EntityExemptList isEdit={true} exempts={exemptionsToShow} exemptsWithoutId={exemptionsToAdd} field={(field) ? field : fieldEntered} fullWith onDeleteExempt={onDeleteExempt} updateExempt={updateExempt}></EntityExemptList>
            ) : (
              <EntityExemptList isEdit={true} exempts={exemptionsToShow} field={(field)?field:fieldEntered} fullWith onDeleteExempt={onDeleteExempt} updateExempt={updateExempt}></EntityExemptList>
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
