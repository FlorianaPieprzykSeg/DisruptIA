import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
    Button,
    Checkbox,
    TableRow,
    TableCell,
    IconButton,
    Box
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
// components
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';
import { fDate } from '../../../utils/formatTime';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import i18next from 'i18next';
import EditExemptDialog from '../../../components/segula-components/EditExemptDialog';
import ViewIncidentDialog from '../../../components/segula-components/ViewIncidentDialog';
import ViewExemptDialog from '../../../components/segula-components/ViewExemptDialog';
import OnlyComViewDialog from '../../../components/segula-components/OnlyComViewDialog';
// ----------------------------------------------------------------------

EntityExemptListTableRow.propTypes = {
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

export default function EntityExemptListTableRow({ isEdit, isCreate, isInList, row, selected, onSelectRow, onDeleteRow, updateExempt, selectedColumns }) {
    const {id, comment, linkedEntityField, linkedEntityModel, updatedAt } = row;

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openPopover, setOpenPopover] = useState(null);

    const [exemptEdit, setExemptEdit] = useState(false);
    const [exemptView, setExemptView] = useState(false);
    const [exemptViewOnly, setExemptViewOnly] = useState(false);

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

    const handleCloseWithDelete = () => {
        onDeleteRow();
        handleCloseConfirm();
    }

    const handleOpenExemptEdit = () => {
        setExemptEdit(true);
    };

    const handleCloseExemptEdit = () => {
        setExemptEdit(false);
    };

    const handleOpenExemptView = () => {
        setExemptView(true);
    };

    const handleCloseExemptView = () => {
        setExemptView(false);
    };

    const handleOpenExemptViewOnly = () => {
        setExemptViewOnly(true);
    };

    const handleCloseExemptViewOnly = () => {
        setExemptViewOnly(false);
    };

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                {selectedColumns.linkedEntityField &&
                    <TableCell>
                        <Box>
                            {(linkedEntityField=="END")?i18next.t('VALIDATION'):i18next.t(linkedEntityField)}
                        </Box>
                    </TableCell>
                }

                {selectedColumns.comment &&
                    <TableCell>
                        <Box>
                            {comment.substring(0, 15)}...
                            <IconButton onClick={() => handleOpenExemptViewOnly()}>
                                <InfoIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </TableCell>
                }

                {selectedColumns.date &&
                    <TableCell>
                        {fDate(updatedAt)}
                    </TableCell>
                }

                {selectedColumns.view &&
                    <TableCell>
                        <IconButton onClick={() => {
                            handleOpenExemptView();
                        }}
                            sx={{ color: 'info.main' }} >
                            <Iconify icon="eva:eye-outline" />
                        </IconButton>
                    </TableCell>
                }

                {selectedColumns.delete && !isInList && (
                    <TableCell>
                        <IconButton onClick={() => {
                            handleOpenConfirm();
                            handleClosePopover();
                        }}
                            sx={{ color: 'error.main' }} >
                            <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                    </TableCell>
                )}

                {/*<TableCell>
                    <IconButton onClick={() => {
                        handleOpenExemptEdit();
                    }}
                        sx={{ color: 'primary.main' }} >
                        <Iconify icon="eva:edit-2-outline" />
                    </IconButton>
                </TableCell>*/}

            </TableRow>

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={handleCloseWithDelete}>
                        Delete
                    </Button>
                }
            />

            <ViewExemptDialog
                open={exemptView}
                onClose={handleCloseExemptView}
                id={id}
                field={linkedEntityField}
                comment={comment}
            />

            <OnlyComViewDialog
                open={exemptViewOnly}
                onClose={handleCloseExemptViewOnly}
                id={id}
                comment={comment}
            />

            <EditExemptDialog
                id={id}
                exempt={comment}
                open={exemptEdit}
                onClose={handleCloseExemptEdit}
                updateExempt={updateExempt}
            />
        </>
    );
}
