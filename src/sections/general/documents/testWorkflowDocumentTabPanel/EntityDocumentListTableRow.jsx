import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    MenuItem,
    TableCell,
    IconButton,
    Typography,
    Box
} from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { fDate } from '../../../../utils/formatTime';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { fData } from '../../../../utils/formatNumber';
import i18next from 'i18next';
import { useEffect } from 'react';
import { documentService } from '../../../../_services/document.service';
// ----------------------------------------------------------------------

EntityDocumentListTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
};

function FileIcon({ fileType }) {
    switch (fileType) {
        case 'pdf':
            return <PictureAsPdfOutlinedIcon />;
        case 'doc':
            return <DescriptionOutlinedIcon />;
        // Add more cases for other file types
        default:
            return <InsertDriveFileOutlinedIcon />;
    }
}

FileIcon.propTypes = {
    fileType: PropTypes.string.isRequired,
};

const GetIconByExtension = (filename) => {
    const fileExtension = filename.split('.').pop().toLowerCase();

    switch (fileExtension) {
        case 'pdf':
            return <PdfIcon />;
        case 'doc':
        case 'docx':
            return <DocIcon />;
        case 'xls':
        case 'xlsx':
            return <XlsIcon />;
        case 'ppt':
        case 'pptx':
            return <PptIcon />;
        default:
            return <UnknownIcon />;
    }
};

export default function EntityDocumentListTableRow({ isEdit, isCreate, isInList = false, row, selected, onSelectRow, onDeleteRow, selectedColumns }) {
    const { docKey, docFilename, docOriginalname, docSize, docUrl, linkedEntityField, linkedEntityModel, updatedAt } = row;

    const [isDoc, setIsDoc] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openPopover, setOpenPopover] = useState(null);

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {

        setOpenConfirm(false);
    };

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    const handleOpenUrl = (docUrl) => {
        if (!docUrl.startsWith('http://') && !docUrl.startsWith('https://')) {
            docUrl = 'https://' + docUrl;
        }
        window.open(docUrl, "_blank");
    }

    const handleDownloadDocument = async () => {
        try {
            if (isDoc) {
                documentService.downloadDocument(linkedEntityModel, docKey, docUrl, docOriginalname);
            } else {
                handleOpenUrl(docUrl);
            }
        } catch (err) {
            console.error('can not download file', err);
        }
    }

    const handleCloseWithDelete = () => {
        onDeleteRow();
        handleCloseConfirm();
    }

    useEffect(() => {
        if (docKey) {
            setIsDoc(true);
        } else {
            if(docUrl.match('^\/api.+') != null) {

                setIsDoc(true);
            } else {
                setIsDoc(false);
            }
        }
    }, [])


    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                {selectedColumns.linkedEntityField &&
                    <TableCell>
                        <Box display="flex" alignItems="center">
                            {(linkedEntityField=="END")?i18next.t('VALIDATION'):i18next.t(linkedEntityField)}
                        </Box>
                    </TableCell>
                }
                {selectedColumns.docName &&
                    <TableCell>
                        <Box display="flex" alignItems="center">
                            {docOriginalname}
                        </Box>
                    </TableCell>
                }

                {selectedColumns.docSize &&
                    <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                                {fData(docSize)}
                            </Typography>
                        </Stack>
                    </TableCell>
                }

                {selectedColumns.date &&
                    <TableCell>
                        {fDate(updatedAt)}
                    </TableCell>
                }

                {selectedColumns.download &&
                    <TableCell>
                        <IconButton onClick={handleDownloadDocument}>
                            {isDoc ? <Iconify icon="eva:download-fill" /> : <Iconify icon="material-symbols:link" /> }
                        </IconButton>
                    </TableCell>
                }

                {selectedColumns.delete && !isInList &&
                    <TableCell>
                        <IconButton onClick={() => {
                            handleOpenConfirm();
                            handleClosePopover();
                        }}
                            sx={{ color: 'error.main' }} >
                            <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                    </TableCell>
                }


            </TableRow>

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title={i18next.t('delete')}
                content={i18next.t('deleteConfirmQuestionMark')}
                action={
                    <Button variant="contained" color="error" onClick={handleCloseWithDelete}>
                        {i18next.t('delete')}
                    </Button>
                }
            />
        </>
    );
}
