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
//import Iconify from '../../../../../../components/iconify';
import Iconify from '../../../../components/iconify/Iconify';
import Scrollbar from '../../../../components/scrollbar';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { useSettingsContext } from '../../../../components/settings';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from '../../../../components/table';
import PropTypes from 'prop-types';
// sections
import EntityDocumentListTableRow from './EntityDocumentListTableRow';
import EntityDocumentListToolbar from './EntityDocumentListToolbar';
import { fDate } from '../../../../utils/formatTime';
import { useSnackbar } from '../../../../components/snackbar';
import { documentService } from '../../../../_services/document.service';
import i18next from 'i18next';
import { useAuthContext } from '../../../../auth/useAuthContext';
import { getConfigColumnFromList, setConfigColumnFromList } from '../../../../utils/userTools';
import { DialogColumns } from '../../../../components/segula-components';
import { ExportToExcel } from '../../../../utils/ExportToExcel';
// file upload

// ----------------------------------------------------------------------
const LIST_ID = 'documents';

const TABLE_HEAD_ONLY_SHOW = [
    { id: 'linkedEntityField', label: 'Field', align: 'left' },
    { id: 'docName', label: 'Doc Name', align: 'left' },
    { id: 'docSize', label: 'Doc Size', align: 'left' },
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'download', label: 'Open File', align: 'left' },
];

const TABLE_HEAD = [
    { id: 'linkedEntityField', label: 'Field', align: 'left' },
    { id: 'docName', label: 'Doc Name', align: 'left' },
    { id: 'docSize', label: 'Doc Size', align: 'left' },
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'download', label: 'Open File', align: 'left' },
    { id: 'delete', label: 'Delete', align: 'left' },
];


// ----------------------------------------------------------------------
const excelFileName = 'Documents Data'
const excelTableHead = ['Field', 'Doc Name', 'Doc Size', 'Date']
// --------------------------------------------
EntityDocumentList.propTypes = {
    isEdit: PropTypes.bool,
    documents: PropTypes.arrayOf(PropTypes.object)

};

export default function EntityDocumentList({ isEdit, isCreate = false, isInList = false, documents, documentsWithoutId , onDeleteDocument, field, documentsToDel, isTotal = false}) {
    const [tableData, setTableData] = useState([]);

    const { user } = useAuthContext();
    let columnConfig = (isInList)?getConfigColumnFromList(user, LIST_ID, TABLE_HEAD_ONLY_SHOW):getConfigColumnFromList(user, LIST_ID, TABLE_HEAD);
    const [columnVisibility, setColumnVisibility] = useState(columnConfig);
    const [isShowColumnFilter, setIsShowColumnFilter] = useState(false);
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
        let documentField = [];
        if(documents) {
            documents.map((doc, index) => {
                if((field && (doc.linkedEntityField == field || doc.field == field)) || !field) {
                    if(isCreate) {
                        doc.id = index;
                        doc.updatedAt = new Date();
                        doc.linkedEntityField = (field || isTotal)?doc.field:'';
                    }
                    documentField.push(doc);
                }
            });
        }
        if(documentsWithoutId) {
            let documentsWithoutIdParsed = JSON.parse(documentsWithoutId.documentsToAdd)
            documentsWithoutIdParsed.map((doc, index) => {
                if((field && (doc.field == field)) || !field) {
                    doc.id = index*(-1);
                    doc.linkedEntityField = (field || isTotal)?doc.field:'';
                    doc.updatedAt = new Date();
                    documentField.push(doc);
                }
            });
        }
        setTableData(documentField);

        const excelData = documentField.map(({ linkedEntityField, docOriginalname, docSize, updatedAt }) => ({ linkedEntityField, docOriginalname, docSize, updatedAt:fDate(updatedAt) }));
        setExcelData(excelData);
    }, [uploaderResponse, documents, documentsWithoutId, documentsToDel, field])


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
        onDeleteDocument(id);
    };

    const handleDeleteRows = (selectedRows) => {
        selectedRows.map(row => {
            onDeleteDocument(row);
        });
    };


    const handleDownloadDocument = (docUrl, docOriginalname) => {
        documentService.downloadDocument(docUrl, docOriginalname);
    }


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
            <><Divider sx={{ borderStyle: 'dashed', borderColor: 'grey.500', marginTop: '30px' }} />
                <Container>
                    <EntityDocumentListToolbar
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
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 700 }} defaultOrderBy='linkedEntityField'>
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
                                            <EntityDocumentListTableRow
                                                key={row.id}
                                                row={row}
                                                isInList={isInList}
                                                selected={selected.includes(row.id)}
                                                onSelectRow={() => onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onDownloadDocument={() => handleDownloadDocument()}
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
            (document) =>
                document.docOriginalname.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                fDate(document.date).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                i18next.t(document.linkedEntityField).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
                document.linkedEntityField.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
        );
    }
    return inputData;
}
