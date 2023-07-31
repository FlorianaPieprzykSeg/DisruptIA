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
import EntityIncidentList from '../../../general/incidents/EntityIncidentList';
import i18next from 'i18next';
import { Assessment } from '@mui/icons-material';

// ----------------------------------------------------------------------

const maxTextUrlLength = 40;

IncidentDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onUploadSuccess: PropTypes.func,
};

export default function IncidentDialog({
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
  incidentsToAdd,
  incidentsToShow,
  incidentsToDel,
  setIncidentInfo,
  onChangeFolderName,
  onIncidentSuccess,
  onDeleteIncident,
  updateIncident,
  documentsToAdd,
  documentsToShow,
  documentsToDel,
  setUploaderInfo,
  onUploadSuccess,
  ...other
}) {
  const ASSIGNEMENTS = ['INTERNAL', 'CUSTOMER'];
  const [uploading, setUploading] = useState(false);
  const [textIncident, setTextIncident] = useState('');
  const [assignementIncident, setAssignementIncident] = useState(ASSIGNEMENTS[0]);
  const [durationIncident, setDurationIncident] = useState('');
  const [fieldEntered, setFieldEntered] = useState((fields != null && fields != [])?fields[0]:'');
  const [files, setFiles] = useState([]);
  const [textURL, setTextURL] = useState('');

  useEffect(() => {
    setFieldEntered((fields != null && fields != [])?fields[0]:'');
  },[field, fields])

  const handleUpload = () => {
    setUploading(true);
    if(textIncident != '' && textIncident != null && assignementIncident != '' && assignementIncident != null && durationIncident != '' && durationIncident && !isNaN(parseInt(durationIncident))) {
        let incident = {
            linkedEntityModel: entity,
            linkedEntityField: (field)?field:fieldEntered,
            assignement: assignementIncident,
            duration: durationIncident,
            comment: textIncident
        }
        console.log(incident);
        const newIncidents = (incidentsToAdd && incidentsToAdd.incidentsToAdd)?JSON.parse(incidentsToAdd.incidentsToAdd).concat([incident]):[incident];
        setIncidentInfo(JSON.stringify(newIncidents), onIncidentSuccess);

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
            setTextURL('');
          }
        }
        setUploading(false);
        setFieldEntered((fields != null && fields != [])?fields[0]:'');
        setTextIncident('');
        setAssignementIncident(ASSIGNEMENTS[0]);
        setDurationIncident('')
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
                sx={{ maxWidth: '50%', marginBottom: '10px', paddingRight: '5px'}}
              />
            }
            defaultValue={fields[0]}
          />
        ))}
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
        <TextField
            sx={{ marginY: 0.2, width: '100%' }}
            label="Comment"
            placeholder='Comment...'
            multiline
            rows={2}
            value={textIncident}
            onChange={(e) => setTextIncident(e.target.value)}
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

        {(textIncident != '' && textIncident != null && assignementIncident != '' && assignementIncident != null && durationIncident != '' && durationIncident && !isNaN(parseInt(durationIncident))) && (
          <Button
            variant="contained"
            onClick={handleUpload}
            sx={{ marginTop: '10px', marginRight: '5px' }}
          >
            Save
          </Button>
        )}

        {isCreate ? (
          (incidentsToAdd && incidentsToAdd.incidentsToAdd) && (
            <EntityIncidentList isCreate={true} incidents={JSON.parse(incidentsToAdd.incidentsToAdd)} field={(field) ? field : fieldEntered} fullWith onDeleteIncident={onDeleteIncident} updateIncident={updateIncident}></EntityIncidentList>
          )
        ) : (
          incidentsToAdd && incidentsToShow && (
            incidentsToAdd.incidentsToAdd ? (
              <EntityIncidentList isEdit={true} incidents={incidentsToShow} incidentsWithoutId={incidentsToAdd} field={(field) ? field : fieldEntered} fullWith onDeleteIncident={onDeleteIncident} updateIncident={updateIncident}></EntityIncidentList>
            ) : (
              <EntityIncidentList isEdit={true} incidents={incidentsToShow} field={(field)?field:fieldEntered} fullWith onDeleteIncident={onDeleteIncident} updateIncident={updateIncident}></EntityIncidentList>
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
