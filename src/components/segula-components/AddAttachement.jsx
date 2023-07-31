import PropTypes from 'prop-types';
// ----------------------------------------------------------------------

import {Box, Button, Dialog, DialogTitle, useTheme } from "@mui/material";
import Iconify from '../iconify/Iconify';
import { useState } from 'react';import UploadLayout from './UploadLayout';
import { FileNewFolderDialog } from '../../sections/dashboard/file';
import CommentLayout from './CommentLayout';
import CommentDialog from '../../sections/dashboard/file/portal/CommentDialog';
import IncidentLayout from './IncidentLayout';
import ExemptLayout from './ExemptLayout';
import ExemptDialog from '../../sections/dashboard/file/portal/ExemptDialog';
import IncidentDialog from '../../sections/dashboard/file/portal/IncidentDialog';


export default function AddAttachement({ entity, documentsToAdd, documentsToShow, documentsToDel, setDocumentsToAdd, setDocumentsToShow, setDocumentsToDel, commentsToAdd, commentsToShow, commentsToDel, setCommentsToAdd, setCommentsToShow, setCommentsToDel, exemptionsToAdd, exemptionsToShow, exemptionsToDel, setExemptionsToAdd, setExemptionsToShow, setExemptionsToDel, incidentsToAdd, incidentsToShow, incidentsToDel, setIncidentsToAdd, setIncidentsToShow, setIncidentsToDel, fields, setTotal, widthGeneral = '100%', ...other }) {

    const theme = useTheme();
    const [openUpload, setOpenDocuments] = useState(false);
    const [openIncidents, setOpenIncidents] = useState(false);
    const [openComments, setOpenComments] = useState(false);
    const [openExempts, setOpenExempts] = useState(false);

    //Handle document Dialog
    const handleOpenUploadDocument = () => {
        setOpenDocuments(true);
    };

    const handleCloseUploadDocument = () => {
        setOpenDocuments(false);
    }

    const handleSetDocumentInfo = (data, callback) => {
        setDocumentsToAdd({documentsToAdd: data});
        handleCloseUploadDocument();
    }

    //Handle comment Dialog
    const handleOpenUploadComment = () => {
        setOpenComments(true);
    };

    const handleCloseUploadComment = () => {
        setOpenComments(false);
    }

    const handleSetCommentInfo = (data, callback) => {
        setCommentsToAdd({commentsToAdd: data});
        handleCloseUploadComment();
    }

    const handleOpenUploadIncident = () => {
      setOpenIncidents(true);
    };

    const handleCloseUploadIncident = () => {
        setOpenIncidents(false);
    }

    const handleSetIncidentInfo = (data, callback) => {
      setIncidentsToAdd({incidentsToAdd: data});
      handleCloseUploadIncident();
    }

    const handleOpenUploadExempt = () => {
      setOpenExempts(true);
    };

    const handleCloseUploadExempt = () => {
        setOpenExempts(false);
    }

    const handleSetExemptInfo = (data, callback) => {
      setExemptionsToAdd({exemptionsToAdd: data});
      handleCloseUploadExempt();
    }

    const updateComment = (id, comment) => {
        if(id <= 0) {
          if(commentsToAdd && commentsToAdd.commentsToAdd) {
            let currentCommentsToAdd = JSON.parse(commentsToAdd.commentsToAdd);
            let newCommentObj = currentCommentsToAdd[id*(-1)];
            newCommentObj.comment = comment;
            currentCommentsToAdd[id*(-1)]= newCommentObj;
            let newCommentsToAddObj = {
                commentsToAdd: JSON.stringify(currentCommentsToAdd)
            }
            setCommentsToAdd(newCommentsToAddObj);
          }
        } else {
            if(commentsToShow) {
                let currentCommentsToShow = commentsToShow;
                let index = currentCommentsToShow.findIndex((com) => com.id == id);
                let newCommentObj = currentCommentsToShow.find((com) => com.id == id);
                newCommentObj.comment = comment;
                currentCommentsToShow[index]= newCommentObj;
                setCommentsToAdd(currentCommentsToShow);
              }
        }
    }

    const onDeleteComment = (id) => {
        if(id <= 0) {
          if(commentsToAdd && commentsToAdd.commentsToAdd) {
            let newCommentsToAdd = JSON.parse(commentsToAdd.commentsToAdd);
            let PrevCommentsToAdd = newCommentsToAdd.splice(id*(-1), 1);
            let newCommentsToAddObj = {
                commentsToAdd: JSON.stringify(newCommentsToAdd)
            }
            setCommentsToAdd(newCommentsToAddObj);
          }
        } else {
          setCommentsToDel(commentsToDel.concat([id]))
          updateCommentsShownWithDeleted(id, commentsToShow, commentsToDel.concat([id]));
        }
    }

    const updateCommentsShownWithDeleted = (id, comments, newCommentsToDel) => {
      let commentsToShowNew = [];
      comments.map((docToShow) => {
        let isInDelete = false;
        newCommentsToDel.map((docToDelId) => {
          if(docToShow.id == docToDelId) {
            isInDelete = true;
          }
        });
        if(!isInDelete) {
          commentsToShowNew.push(docToShow);
        }
      })
      if(commentsToShowNew != []) {
        setCommentsToShow(commentsToShowNew);
      }
    }

    const onDeleteDocument = (id) => {
        if(id <= 0) {
          if(documentsToAdd && documentsToAdd.documentsToAdd) {
            let newDocumentsToAdd = JSON.parse(documentsToAdd.documentsToAdd);
            let PrevDocumentsToAdd = newDocumentsToAdd.splice(id*(-1), 1);
            let newDocumentsToAddObj = {
              documentsToAdd: JSON.stringify(newDocumentsToAdd)
            }
            setDocumentsToAdd(newDocumentsToAddObj);
          }
        } else {
          setDocumentsToDel(documentsToDel.concat([id]))
          updateDocumentsShownWithDeleted(id, documentsToShow, documentsToDel.concat([id]));
        }
    }

    const updateDocumentsShownWithDeleted = (id, documents, newDocumentsToDel) => {
      let documentsToShowNew = [];
      documents.map((docToShow) => {
        let isInDelete = false;
        newDocumentsToDel.map((docToDelId) => {
          if(docToShow.id == docToDelId) {
            isInDelete = true;
          }
        });
        if(!isInDelete) {
          documentsToShowNew.push(docToShow);
        }
      })
      if(documentsToShowNew != []) {
        setDocumentsToShow(documentsToShowNew);
      }
    }

    const onDeleteIncident = (id) => {
      if(id <= 0) {
        if(incidentsToAdd && incidentsToAdd.incidentsToAdd) {
          let newincidentsToAdd = JSON.parse(incidentsToAdd.incidentsToAdd);
          let PrevincidentsToAdd = newincidentsToAdd.splice(id*(-1), 1);
          let newincidentsToAddObj = {
              incidentsToAdd: JSON.stringify(newincidentsToAdd)
          }
          setIncidentsToAdd(newincidentsToAddObj);
        }
      } else {
        setIncidentsToDel(incidentsToDel.concat([id]))
        updateIncidentsShownWithDeleted(id, incidentsToShow, incidentsToDel.concat([id]));
      }
  }

  const updateIncidentsShownWithDeleted = (id, incidents, newincidentsToDel) => {
    let incidentsToShowNew = [];
    incidents.map((docToShow) => {
      let isInDelete = false;
      newincidentsToDel.map((docToDelId) => {
        if(docToShow.id == docToDelId) {
          isInDelete = true;
        }
      });
      if(!isInDelete) {
        incidentsToShowNew.push(docToShow);
      }
    })
    if(incidentsToShowNew != []) {
      setIncidentsToShow(incidentsToShowNew);
    }
  }

  const onDeleteExempt = (id) => {
    if(id <= 0) {
      if(exemptionsToAdd && exemptionsToAdd.exemptionsToAdd) {
        let newexemptionsToAdd = JSON.parse(exemptionsToAdd.exemptionsToAdd);
        let PrevexemptionsToAdd = newexemptionsToAdd.splice(id*(-1), 1);
        let newexemptionsToAddObj = {
            exemptionsToAdd: JSON.stringify(newexemptionsToAdd)
        }
        setExemptionsToAdd(newexemptionsToAddObj);
      }
    } else {
      setExemptionsToDel(exemptionsToDel.concat([id]))
      updateExemptsShownWithDeleted(id, exemptionsToShow, exemptionsToDel.concat([id]));
    }
}

const updateExemptsShownWithDeleted = (id, exempts, newexemptionsToDel) => {
  let exemptionsToShowNew = [];
  exempts.map((docToShow) => {
    let isInDelete = false;
    newexemptionsToDel.map((docToDelId) => {
      if(docToShow.id == docToDelId) {
        isInDelete = true;
      }
    });
    if(!isInDelete) {
      exemptionsToShowNew.push(docToShow);
    }
  })
  if(exemptionsToShowNew != []) {
    setExemptionsToShow(exemptionsToShowNew);
  }
}

  return (
    <Box width={widthGeneral} display={'flex'} marginTop={5} columnGap={'2%'} height='55px'>
        <UploadLayout isEdit={true} handleOpenUploadFile={handleOpenUploadDocument} documents={documentsToShow} documentsWithoutId={(documentsToAdd && documentsToAdd.documentsToAdd)?JSON.parse(documentsToAdd.documentsToAdd):null} isAttachement={true}/>
        <CommentLayout isEdit={true} handleOpenUploadComment={handleOpenUploadComment} comments={commentsToShow} commentsWithoutId={(commentsToAdd && commentsToAdd.commentsToAdd)?JSON.parse(commentsToAdd.commentsToAdd):null} isAttachement={true}/>
        <IncidentLayout isEdit={true} handleOpenUploadIncident={handleOpenUploadIncident} incidents={incidentsToShow} incidentsWithoutId={(incidentsToAdd && incidentsToAdd.incidentsToAdd)?JSON.parse(incidentsToAdd.incidentsToAdd):null} isAttachement={true}/>
        <ExemptLayout isEdit={true} handleOpenUploadExempt={handleOpenUploadExempt} exempts={exemptionsToShow} exemptsWithoutId={(exemptionsToAdd && exemptionsToAdd.exemptionsToAdd)?JSON.parse(exemptionsToAdd.exemptionsToAdd):null} isAttachement={true}/>

        <FileNewFolderDialog isCreate={false} open={openUpload} onClose={handleCloseUploadDocument} entity='wfDoVal' documentsToAdd={documentsToAdd} documentsToShow={documentsToShow} setUploaderInfo={handleSetDocumentInfo} onDeleteDocument={onDeleteDocument} fields={fields}/>
        <CommentDialog isCreate={false} open={openComments} onClose={handleCloseUploadComment} entity='wfDoVal' commentsToAdd={commentsToAdd} commentsToShow={commentsToShow} setCommentInfo={handleSetCommentInfo} onDeleteComment={onDeleteComment} fields={fields} updateComment={updateComment}/>
        <IncidentDialog isCreate={false} open={openIncidents} onClose={handleCloseUploadIncident} entity='wfDoVal' incidentsToAdd={incidentsToAdd} incidentsToShow={incidentsToShow} setIncidentInfo={handleSetIncidentInfo} onDeleteIncident={onDeleteIncident} documentsToAdd={documentsToAdd} documentsToShow={documentsToShow} setUploaderInfo={handleSetDocumentInfo} fields={fields}/>
        <ExemptDialog isCreate={false} open={openExempts} onClose={handleCloseUploadExempt} entity='wfDoVal' exemptionsToAdd={exemptionsToAdd} exemptionsToShow={exemptionsToShow} setExemptInfo={handleSetExemptInfo} onDeleteExempt={onDeleteExempt} documentsToAdd={documentsToAdd} documentsToShow={documentsToShow} setUploaderInfo={handleSetDocumentInfo} fields={fields}/>
    </Box>
  );
}

