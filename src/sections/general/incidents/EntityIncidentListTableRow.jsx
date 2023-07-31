import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
    Button,
    Checkbox,
    TableRow,
    TableCell,
    IconButton,
    Box,
    Typography
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
import EditIncidentDialog from '../../../components/segula-components/EditIncidentDialog';
import ViewIncidentDialog from '../../../components/segula-components/ViewIncidentDialog';
import OnlyComViewDialog from '../../../components/segula-components/OnlyComViewDialog';
// ----------------------------------------------------------------------

EntityIncidentListTableRow.propTypes = {
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

export default function EntityIncidentListTableRow({ isEdit, isCreate, isInList = false, row, selected, onSelectRow, onDeleteRow, updateIncident, selectedColumns }) {
    const {id, assignement, duration, comment, linkedEntityField, linkedEntityModel, updatedAt } = row;

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openPopover, setOpenPopover] = useState(null);

    const [incidentEdit, setIncidentEdit] = useState(false);
    const [incidentView, setIncidentView] = useState(false);
    const [incidentViewOnly, setIncidentViewOnly] = useState(false);

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

    const handleOpenIncidentEdit = () => {
        setIncidentEdit(true);
    };

    const handleCloseIncidentEdit = () => {
        setIncidentEdit(false);
    };

    const handleOpenIncidentView = () => {
        setIncidentView(true);
    };

    const handleCloseIncidentView = () => {
        setIncidentView(false);
    };

    const handleOpenIncidentViewOnly = () => {
        setIncidentViewOnly(true);
    };

    const handleCloseIncidentViewOnly = () => {
        setIncidentViewOnly(false);
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

                {selectedColumns.assignement &&
                    <TableCell>
                        <Box>
                            {i18next.t(assignement)}
                        </Box>
                    </TableCell>
                }

                {selectedColumns.duration &&
                    <TableCell>
                        <Box>
                            {duration}
                        </Box>
                    </TableCell>
                }

                {selectedColumns.comment &&
                    <TableCell>
                        <Box>
                            {comment.substring(0, 15)}...
                            <IconButton onClick={() => handleOpenIncidentViewOnly()}>
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
                            handleOpenIncidentView();
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
                        handleOpenIncidentEdit();
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

            <ViewIncidentDialog
                open={incidentView}
                onClose={handleCloseIncidentView}
                id={id}
                field={linkedEntityField}
                assignement={assignement}
                duration={duration}
                comment={comment}
            />

            <OnlyComViewDialog
                open={incidentViewOnly}
                onClose={handleCloseIncidentViewOnly}
                id={id}
                comment={comment}
            />

            <EditIncidentDialog
                id={id}
                incident={comment}
                open={incidentEdit}
                onClose={handleCloseIncidentEdit}
                updateIncident={updateIncident}
            />
        </>
    );
}
