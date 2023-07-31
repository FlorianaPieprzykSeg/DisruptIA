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
} from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { Upload } from '../../../../components/upload';

//Post files
import Axios from '../../../../_services/caller.service';
import { RHFAutocomplete } from '../../../../components/hook-form';
import EntityIncidentList from '../../../general/incidents/EntityIncidentList';
import i18next from 'i18next';
import { Assessment } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const maxTextUrlLength = 40;

FixValidationDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
};

export default function FixValidationDialog({
  title = 'Add attachements with documents linked to changed fields',
  open,
  onClose,
  onCloseOnly,
  //
  isCreate = false,
  onCreate,
  onUpdate,
  //
  folderName,
  entity,
  changedValues,
  incidentsToAdd,
  incidentsToShow,
  setIncidentsToAdd,
  setIncidentsToShow,
  exemptionsToAdd,
  exemptionsToShow,
  setExemptionsToAdd,
  setExemptionsToShow,
  onChangeFolderName,
  updateIncident,
  documentsToAdd,
  documentsToShow,
  setDocumentsToAdd,
  setDocumentsToShow,
  ...other
}) {
  const { enqueueSnackbar } = useSnackbar();
  const ASSIGNEMENTS = ['INTERNAL', 'CUSTOMER'];
  const [uploading, setUploading] = useState(false);
  const [field, setField] = useState('');
  const [textComment, setTextComment] = useState('');
  const [assignementIncident, setAssignementIncident] = useState(ASSIGNEMENTS[0]);
  const [durationIncident, setDurationIncident] = useState('');
  const [files, setFiles] = useState([]);
  const [textURL, setTextURL] = useState('');

  const [index, setIndex] = useState(0);

  const [typeOfAttachement, setTypeOfAttachement] = useState('EXEMPT');

  const setExemptInfo = (data, callback) => {
    setExemptionsToAdd({exemptionsToAdd: data});
  }

  const setIncidentInfo = (data, callback) => {
    setIncidentsToAdd({incidentsToAdd: data});
  }

  const setUploaderInfo = (data, callback) => {
    setDocumentsToAdd({documentsToAdd: data});
  }

  const handleUploadAndClose = () => {
    handleUpload();
    handleClose();
  }

  const handleClose = () => {
    onClose();
    setIndex(0);
  }

  const handleCloseOnly = () => {
    onCloseOnly();
    setIndex(0);
  }

  const handleUpload = () => {
    setUploading(true);
    if(typeOfAttachement == 'INCIDENT') {
      if(textComment != '' && textComment != null && assignementIncident != '' && assignementIncident != null && durationIncident != '' && durationIncident && !isNaN(parseInt(durationIncident))) {
        let incident = {
            linkedEntityModel: entity,
            linkedEntityField: field,
            assignement: assignementIncident,
            duration: durationIncident,
            comment: textComment
        }
        const newIncidents = (incidentsToAdd && incidentsToAdd.incidentsToAdd)?JSON.parse(incidentsToAdd.incidentsToAdd).concat([incident]):[incident];
        setIncidentInfo(JSON.stringify(newIncidents));

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
            res.data.map((doc) => {
              doc.field = field
              doc.linkedEntityField = field;
            });
            const newDocuments = (documentsToAdd && documentsToAdd.documentsToAdd)?JSON.parse(documentsToAdd.documentsToAdd).concat(res.data):res.data;
            setUploaderInfo(JSON.stringify(newDocuments));

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
                field:field,
                linkedEntityField:field,
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
              field:field,
              linkedEntityField:field,
            }];
            const newDocuments = (documentsToAdd && documentsToAdd.documentsToAdd)?JSON.parse(documentsToAdd.documentsToAdd).concat(newUrl):newUrl;
            setUploaderInfo(JSON.stringify(newDocuments));
            setTextURL('');
          }
        }
        setUploading(false);
        setTextComment('');
        setAssignementIncident(ASSIGNEMENTS[0]);
        setDurationIncident('')
        setTextURL('');
        setFiles([]);
        enqueueSnackbar('Attachements added!')
        setIndex(index+1);
      }
    } else if(typeOfAttachement == 'EXEMPT') {
      if(textComment != null && textComment != '') {
        let exempt = {
            linkedEntityModel: entity,
            linkedEntityField: field,
            comment: textComment
        }
        const newExempts = (exemptionsToAdd && exemptionsToAdd.exemptionsToAdd)?JSON.parse(exemptionsToAdd.exemptionsToAdd).concat([exempt]):[exempt];
        setExemptInfo(JSON.stringify(newExempts));

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
              res.data.map((doc) => {
                doc.field = field,
                doc.linkedEntityField = field;
              });
            }
            const newDocuments = (documentsToAdd && documentsToAdd.documentsToAdd)?JSON.parse(documentsToAdd.documentsToAdd).concat(res.data):res.data;
            setUploaderInfo(JSON.stringify(newDocuments));

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
                field:field,
                linkedEntityField:field,
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
              field:field,
              linkedEntityField:field,
            }];
            const newDocuments = (documentsToAdd && documentsToAdd.documentsToAdd)?JSON.parse(documentsToAdd.documentsToAdd).concat(newUrl):newUrl;
            setUploaderInfo(JSON.stringify(newDocuments));
          }
        }   
        setUploading(false);
        setTextComment('');
        setTextURL('');
        setFiles([]);
        enqueueSnackbar('Attachements added!')
        setIndex(index+1);
      }
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

  const handleSetIncidentInfo = (data, callback) => {
    setIncidentsToAdd({incidentsToAdd: data});
    handleCloseUploadIncident();
  }

  useEffect(() => {
    if(changedValues) {
      if(index <= changedValues.length-1) {
        setField(changedValues[index].field);
        if(changedValues[index].type == 'DATE') {
          setTypeOfAttachement('INCIDENT')
        } else {
          setTypeOfAttachement('EXEMPT')
        }
      }
    }
  }, [index, changedValues]);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleCloseOnly} {...other}>
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
        <TextField
            sx={{ maxWidth: '50%', marginBottom: '10px', paddingRight: '5px' }}
            label="Field Linked"
            value={(field == 'END')?i18next.t('VALIDATION'):(i18next.t(field))}
            disabled
        />
        {typeOfAttachement == 'INCIDENT' && (
          <Box
            display="grid"
            gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            }}
          > 
            <Autocomplete
              id="combo-box-demo"
              options={ASSIGNEMENTS}
              getOptionLabel={(opt) => (i18next.t(opt))}
              onChange={(e, value) => {setAssignementIncident(value)}}
              renderInput={(params) =>
                <TextField
                  {...params}
                  label={'Assignement'}
                  sx={{marginBottom: '5px', paddingRight: '5px'}}
                />
              }
              defaultValue={ASSIGNEMENTS[0]}
            />
            <TextField
                sx={{ paddingLeft: '5px'}}
                label="Duration"
                value={durationIncident}
                onChange={(e) => setDurationIncident(e.target.value)}
            />
          </Box>
        )}
        <TextField
            sx={{ marginY: 0.2, width: '100%' }}
            label="Comment"
            placeholder='Comment...'
            multiline
            rows={2}
            value={textComment}
            onChange={(e) => setTextComment(e.target.value)}
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
        
      </DialogContent>

      <DialogActions>
        {(typeOfAttachement == 'INCIDENT' && (textComment != '' && textComment != null && assignementIncident != '' && assignementIncident != null && durationIncident != '' && durationIncident && !isNaN(parseInt(durationIncident)) && ((files && files.length>0) || textURL)) && (index < changedValues.length-1)) ? (
          <Button
            variant="contained"
            onClick={handleUpload}
            endIcon={<Iconify icon="eva:arrow-ios-forward-outline" />}
          >
            Next
          </Button>
        ) : (
          (typeOfAttachement == 'EXEMPT' && (textComment != '' && textComment != null && ((files && files.length>0) || textURL)) && (index < changedValues.length-1)) ? (
            <Button
              variant="contained"
              onClick={handleUpload}
              endIcon={<Iconify icon="eva:arrow-ios-forward-outline" />}
            >
              Next
            </Button>
          ) : (changedValues && index < changedValues.length-1) && (
            <Button
              variant="contained"
              onClick={handleUpload}
              endIcon={<Iconify icon="eva:arrow-ios-forward-outline" />}
              disabled
            >
              Next
            </Button>
          )
        )}
        {(changedValues && (index == changedValues.length-1)) ? (
          (typeOfAttachement == 'INCIDENT' && (textComment != '' && textComment != null && assignementIncident != '' && assignementIncident != null && durationIncident != '' && durationIncident && !isNaN(parseInt(durationIncident)) && ((files && files.length>0) || textURL))) ? (
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:close-fill" />}
              onClick={handleUploadAndClose}
            >
              Save and Close
            </Button>
          ) : (
            (typeOfAttachement == 'EXEMPT' && (textComment != '' && textComment != null && ((files && files.length>0) || textURL))) ? (
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:close-fill" />}
                onClick={handleUploadAndClose}
              >
                Save and Close
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:close-fill" />}
                onClick={handleCloseOnly}
                sx={{ backgroundColor: 'background.neutral'}}
              >
                Close
              </Button>
            )
          )
        ) : (
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:close-fill" />}
            onClick={handleCloseOnly}
            sx={{ backgroundColor: 'background.neutral'}}
          >
            Close
          </Button>
        )}
      </DialogActions>
  
    </Dialog>
  );
}
