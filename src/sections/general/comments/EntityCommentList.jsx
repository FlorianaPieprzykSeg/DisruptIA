import { useState, useEffect } from 'react';

// @mui
import {
    Card,
    Table,
    Button,
    Tooltip,
    TableBody,
    Container,
    Paper,
    IconButton,
    TableContainer,
    Divider,
} from '@mui/material';

// components
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import { useSettingsContext } from '../../../components/settings';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from '../../../components/table';
import PropTypes from 'prop-types';
// sections
import { fDate } from '../../../utils/formatTime';
import EntityCommentListToolbar from './EntityCommentListToolbar';
import EntityCommentListTableRow from './EntityCommentListTableRow';
import Iconify from '../../../components/iconify/Iconify';
import i18next from 'i18next';
import { DialogColumns } from '../../../components/segula-components';
import { useAuthContext } from '../../../auth/useAuthContext';
import { getConfigColumnFromList, setConfigColumnFromList } from '../../../utils/userTools';
import { ExportToExcel } from '../../../utils/ExportToExcel';
// file upload

// ----------------------------------------------------------------------
const LIST_ID = 'comments';

const TABLE_HEAD = [
    { id: 'linkedEntityField', label: 'Field', align: 'left' },
    { id: 'comment', label: 'Comment', align: 'left' },
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'view', label: 'Visualize', align: 'left' },
    { id: 'delete', label: 'Delete', align: 'left' },
    //{ id: 'edit', label: 'Edit'},
];

const TABLE_HEAD_ONLY_SHOW = [
    { id: 'linkedEntityField', label: 'Field', align: 'left' },
    { id: 'comment', label: 'Comment', align: 'left' },
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'view', label: 'Visualize', align: 'left' },
    //{ id: 'edit', label: 'Edit'},
];

const excelFileName = 'Comments Data'
const excelTableHead = ['Field', 'Comment', 'Date']
// --------------------------------------------
EntityCommentList.propTypes = {
    isEdit: PropTypes.bool,
    comments: PropTypes.arrayOf(PropTypes.object)
};

export default function EntityCommentList({ isEdit, isCreate = false, isInList = false, comments, commentsWithoutId , onDeleteComment, updateComment, field, commentsToDel, isTotal = false}) {
    const [tableData, setTableData] = useState([]);

    const { user } = useAuthContext();
    let columnConfig = (isInList)?getConfigColumnFromList(user, LIST_ID, TABLE_HEAD_ONLY_SHOW):getConfigColumnFromList(user, LIST_ID, TABLE_HEAD);
    const [columnVisibility, setColumnVisibility] = useState(columnConfig);
    const [isShowColumnFilter, setIsShowColumnFilter] = useState(false)
    const [excelData, setExcelData] = useState([]);

    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({
            defaultOrderBy: 'linkedEntityField',
            defaultOrder: 'desc'
        }
    );



    const { themeStretch } = useSettingsContext();

    const [openConfirm, setOpenConfirm] = useState(false);

    const [filterSearch, setFilterSearch] = useState('');

    const [uploaderResponse, setUploaderResponse] = useState(null);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterSearch,
    });

    const denseHeight = dense ? 52 : 72;

    const isFiltered = filterSearch !== ''

    const isNotFound = (!dataFiltered.length && !!filterSearch)

    useEffect(() => {
        let commentField = [];
        if(comments) {
            comments.map((com, index) => {
                if((field && (com.linkedEntityField == field || com.field == field)) || !field) {
                    if(isCreate) {
                        com.id = index;
                    }
                    commentField.push(com);
                }
            });
        }
        if(commentsWithoutId) {
            let commentsWithoutIdParsed = JSON.parse(commentsWithoutId.commentsToAdd)
            commentsWithoutIdParsed.map((com, index) => {
                if((field && (com.linkedEntityField == field)) || !field) {
                        com.id = index*(-1);
                        com.linkedEntityField = (field || isTotal)?com.linkedEntityField:'';
                        com.updatedAt = new Date();
                        commentField.push(com);
                }
            });
        }
        setTableData(commentField);

        const excelData = commentField.map(({ linkedEntityField, comment, updatedAt }) => ({ linkedEntityField, comment, updatedAt:fDate(updatedAt) }));
        setExcelData(excelData);
    }, [uploaderResponse, comments, commentsWithoutId, commentsToDel, field])


    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleFilterSearch = (event) => {
        setPage(0);
        setFilterSearch(event.target.value);
    };

    const handleDeleteRow = (id) => {
        onDeleteComment(id);
    };

    const handleDeleteRows = (selectedRows) => {
        selectedRows.map(row => {
            onDeleteComment(row);
        });
    };

    const handleResetFilter = () => {
        setFilterSearch('');
    };

    const handleColumnVisibilityChange = (event) => {
        const { name, checked } = event.target;
    
        const updatedCol = {};
        updatedCol[name] = checked;
        let newCols = {...columnVisibility,...updatedCol};
        setColumnVisibility(newCols);
        setConfigColumnFromList(user, LIST_ID, newCols);
    };

    const handleOnCloseDialogColumns = () => {
        setIsShowColumnFilter(false);
    }
    const hanldeShowColumnFilter = () => {
        setIsShowColumnFilter(!isShowColumnFilter)
    }

    return (
        <>
        {tableData.length != 0 && (
            <><Container>
                    <EntityCommentListToolbar
                        isFiltered={isFiltered}
                        filterSearch={filterSearch}
                        onfilterSearch={handleFilterSearch}
                        onResetFilter={handleResetFilter} 
                    />
                    <ExportToExcel apiData={excelData} fileName={excelFileName} tableHead={excelTableHead}></ExportToExcel>
                    <IconButton onClick={hanldeShowColumnFilter}><Iconify icon="ic:outline-remove-red-eye" ></Iconify></IconButton>
                    <DialogColumns open={isShowColumnFilter} onClose={handleOnCloseDialogColumns} columns={(isInList)?TABLE_HEAD_ONLY_SHOW:TABLE_HEAD} columnVisibility={columnVisibility} handleColumnVisibilityChange={handleColumnVisibilityChange} />
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }} component={Paper}>
                        {isEdit && <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={tableData.length}
                            onSelectAllRows={(checked) => onSelectAllRows(
                                checked,
                                tableData.map((row) => row.id)
                            )}
                            action={<Tooltip title="Delete">
                                <IconButton color="primary" onClick={handleOpenConfirm}>
                                    <Iconify icon="eva:trash-2-outline" />
                                </IconButton>
                            </Tooltip>} />}
                        <Scrollbar>
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }} defaultOrderBy='linkedEntityField'>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={(isInList)?TABLE_HEAD_ONLY_SHOW.filter((column) => columnVisibility[column.id]):TABLE_HEAD.filter((column) => columnVisibility[column.id])}
                                    rowCount={tableData.length}
                                    numSelected={selected.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) => onSelectAllRows(
                                        checked,
                                        tableData.map((row) => row.id)
                                    )} />
                                <TableBody>
                                    {dataFiltered
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <EntityCommentListTableRow
                                                key={row.id}
                                                row={row}
                                                isInList={isInList}
                                                selected={selected.includes(row.id)}
                                                onSelectRow={() => onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                updateComment={updateComment}
                                                isEdit={isEdit}
                                                isCreate={isCreate}
                                                selectedColumns={columnVisibility}
                                            />
                                        ))}
                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />
                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                    <TablePaginationCustom
                        count={dataFiltered.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        //
                        dense={dense}
                        onChangeDense={onChangeDense} />
                </Container>
                <ConfirmDialog
                    open={openConfirm}
                    onClose={handleCloseConfirm}
                    title="Delete"
                    content={<>
                        Are you sure want to delete <strong> {selected.length} </strong> items?
                    </>}
                    action={<Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteRows(selected);
                        } }
                    >
                        Delete
                    </Button>} />
                </>
        )}
        </>
    );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterSearch }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterSearch) {
        inputData = inputData.filter(
            (comment) =>
                comment.comment.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                fDate(comment.date).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                i18next.t(comment.linkedEntityField).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                comment.linkedEntityField.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                comment.comment.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
        );
    }
    return inputData;
}
