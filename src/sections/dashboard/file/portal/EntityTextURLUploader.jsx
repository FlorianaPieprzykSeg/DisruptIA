import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box } from '@mui/material';
import EntityDocumentList from '../../../general/documents/testWorkflowDocumentTabPanel/EntityDocumentList';
import Iconify from '../../../../components/iconify/Iconify';
const maxTextUrlLength = 40;
const EntityTextURLUploader = ({ 
  isEdit, 
  open, 
  onClose, 
  onUploadSuccess, 
  onSetUploadInfo, 
  onUpload, 
  field, 
  documentsToAdd, 
  documentsToShow, 
  onDeleteDocument 
}) => {

    const [textURL, setTextURL] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleUpload = () => {
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
          field:field
        }];
        const newDocuments = (documentsToAdd && documentsToAdd.documentsToAdd)?JSON.parse(documentsToAdd.documentsToAdd).concat(newUrl):newUrl;
        onSetUploadInfo(JSON.stringify(newDocuments));
    };

      return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
          <DialogTitle>Upload Text URL</DialogTitle>
          <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
            <TextField
              fullWidth
              label="Text URL"
              value={textURL}
              onChange={(e) => setTextURL(e.target.value)}
            />
            {uploading ? (
              <CircularProgress size={24} />
            ) : (
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                onClick={handleUpload}
                sx={{ marginTop: '10px', marginRight: '5px' }}
                disabled={!textURL}
              >
                Upload
              </Button>
            )}
            <EntityDocumentList isEdit={true} documents={documentsToShow} documentsToAdd={documentsToAdd} field={field} fullWith onDeleteDocument={onDeleteDocument}></EntityDocumentList>
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
      
};

export default EntityTextURLUploader;