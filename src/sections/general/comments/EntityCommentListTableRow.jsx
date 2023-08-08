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
import EditCommentDialog from '../../../components/segula-components/EditCommentDialog';
import ViewCommentDialog from '../../../components/segula-components/ViewCommentDialog';
import OnlyComViewDialog from '../../../components/segula-components/OnlyComViewDialog';
// ----------------------------------------------------------------------

EntityCommentListTableRow.propTypes = {
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

export default function EntityCommentListTableRow({ isEdit, isCreate, isInList = false, row, selected, onSelectRow, onDeleteRow, updateComment, selectedColumns }) {
    const {id, comment, linkedEntityField, linkedEntityModel, updatedAt } = row;

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openPopover, setOpenPopover] = useState(null);

    const [commentEdit, setCommentEdit] = useState(false);
    const [commentView, setCommentView] = useState(false);
    const [commentViewOnly, setCommentViewOnly] = useState(false);

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

    const handleOpenCommentEdit = () => {
        setCommentEdit(true);
    };

    const handleCloseCommentEdit = () => {
        setCommentEdit(false);
    };

    const handleOpenCommentView = () => {
        setCommentView(true);
    };

    const handleCloseCommentView = () => {
        setCommentView(false);
    };

    const handleOpenCommentViewOnly = () => {
        setCommentViewOnly(true);
    };

    const handleCloseCommentViewOnly = () => {
        setCommentViewOnly(false);
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
                            <IconButton onClick={() => handleOpenCommentViewOnly()}>
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
                            handleOpenCommentView();
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
                        handleOpenCommentEdit();
                    }}
                        sx={{ color: 'primary.main' }} >
                        <Iconify icon="eva:edit-2-outline" />
                    </IconButton>
                </TableCell>*/}

            </TableRow>

            <ViewCommentDialog
                open={commentView}
                onClose={handleCloseCommentView}
                id={id}
                field={linkedEntityField}
                comment={comment}
            />

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

            <OnlyComViewDialog
                open={commentViewOnly}
                onClose={handleCloseCommentViewOnly}
                id={id}
                comment={comment}
            />

            <EditCommentDialog
                id={id}
                comment={comment}
                open={commentEdit}
                onClose={handleCloseCommentEdit}
                updateComment={updateComment}
            />
        </>
    );
}
