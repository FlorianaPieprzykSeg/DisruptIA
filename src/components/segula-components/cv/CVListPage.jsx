import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { userService } from "../../../_services/user.service";
import { ExportToExcel } from '../../../utils/ExportToExcel';

// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  useTheme,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
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
// sections
import { fDate } from '../../../utils/formatTime';
import i18next from 'i18next';
import { Stack } from '@mui/system';
import { AnalyticsCount } from '../../../sections/general/analytics';
import { DialogColumns } from '../../../components/segula-components';
import { useAuthContext } from '../../../auth/useAuthContext';
import { getConfigColumnFromList, setConfigColumnFromList } from '../../../utils/userTools';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import CVTableToolbar from './CVTableToolbar';
import { CVTableRow } from '.';

// ----------------------------------------------------------------------
const LIST_ID = 'cv';

const STATUS_OPTIONS = ['all'];

const ROLE_OPTIONS = [
  'all'
];

const TABLE_HEAD = [
  { id: 'id', label: i18next.t('id'), align: 'left' },
  { id: 'firstName', label: "Prénom", align: 'left' },
  { id: 'lastName', label: "Nom", align: 'left' },
  { id: 'lien', label: "Emetteur", align: 'left' },
  { id: 'localisation', label: "Localisation", align: 'left' },
  { id: '', label: ''},
];

const excelTableHead = [i18next.t('id'), i18next.t('cat'), i18next.t('firstName'), i18next.t('lastName'), i18next.t('username'), i18next.t('email'), i18next.t('createdAt'), i18next.t('updatedAt'), ' ']
const excelFileName = i18next.t('excelName')

const cvsInitial = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupré',
    lien: 'IC - Radar de compétence',
    localisation: 'Elancourt',
  },
  {
    id: 2,
    firstName: 'Lucie',
    lastName: 'Vento',
    lien: 'IC - Radar de compétence',
    localisation: 'Paris',
  },
  {
    id: 3,
    firstName: 'Marcus',
    lastName: 'Ambemou',
    lien: 'Smart Recruiter',
    localisation: 'Sceaux',
  },
  {
    id: 4,
    firstName: 'Nassima',
    lastName: 'Ould Ouali',
    lien: 'Smart Recruiter',
    localisation: 'Chaville',
  },
  {
    id: 5,
    firstName: 'Christophe',
    lastName: 'Laurent',
    lien: 'MySkills',
    localisation: 'Marne-la-Vallée',
  },
]

// ----------------------------------------------------------------------

export default function CVListPage({setIsProfilSelected}) {

  const { user } = useAuthContext();

  let columnConfig = getConfigColumnFromList(user, LIST_ID, TABLE_HEAD);

  const {presetsOption } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [cvs, setCVs] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState(columnConfig);
  const [isShowColumnFilter, setIsShowColumnFilter] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
 

  useEffect(() => {
    const _resData = cvsInitial.map(
      ({ id, firstName, lastName, lien, localisation }) => ({ id, firstName, lastName, lien, localisation }));
    setTableData(_resData);
    const excelData = _resData.map(obj => {
      const { [Object.keys(obj).pop()]: prop, ...rest } = obj;
      return rest;
    });
    setExportData(excelData);

  }, []);

  useEffect(() => {
    if(tableData.length > 0) {
      setShowLoading(false);
    }
  }, [tableData]);

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
  } = useTable();


  const theme = useTheme();
  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterSearch, setFilterSearch] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterFirstDate, setFilterFirstDate] = useState("");

  const [filterLastDate, setFilterLastDate] = useState("");

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterSearch,
    filterRole,
    filterFirstDate,
    filterLastDate,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterSearch !== '' || filterFirstDate !== "" || filterLastDate !== "" || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterSearch) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterFirstDate) ||
    (!dataFiltered.length && !!filterLastDate) ||
    (!dataFiltered.length && !!filterStatus);
  


  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterSearch = (event) => {
    setPage(0);
    setFilterSearch(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleFilterFirstDate = (event) => {
    setPage(0);
    setFilterFirstDate(event.target.value);
  };

  const handleFilterLastDate = (event) => {
    setPage(0);
    setFilterLastDate(event.target.value);
  };

  const handleDeleteRow = (id) => {
    userService.deleteCV(id)
        .then(res => {
            // Mise à jour du state pour affichage
            setTableData((current) => current.filter(user => user.id !== id))
            setSelected([]);
        })
        .catch(err => console.log(err))
    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };


  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const hanldeShowColumnFilter = () =>{
    setIsShowColumnFilter(!isShowColumnFilter)
  }

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.cv.edit(paramCase(id.toString())));
  };

  const handleResetFilter = () => {
    setFilterSearch('');
    setFilterRole('all');
    setFilterStatus('all');
    setFilterFirstDate("");
    setFilterLastDate("");
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

  return (
    <>
      <LoadingScreen isLoading={showLoading}/>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Card>
          <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab} label={i18next.t(tab)} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <CVTableToolbar
            isFiltered={isFiltered}
            filterSearch={filterSearch}
            filterRole={filterRole}
            optionsRole={ROLE_OPTIONS}
            filterFirstDate={filterFirstDate}
            filterLastDate={filterLastDate}
            onfilterSearch={handleFilterSearch}
            onFilterRole={handleFilterRole}
            onFilterFirstDate={handleFilterFirstDate}
            onFilterLastDate={handleFilterLastDate}
            onResetFilter={handleResetFilter}
          />
          <ExportToExcel apiData={exportData} fileName={excelFileName} tableHead={excelTableHead}></ExportToExcel>
          <IconButton onClick={hanldeShowColumnFilter}><Iconify icon="ic:outline-remove-red-eye" ></Iconify></IconButton>
          <DialogColumns open={isShowColumnFilter} onClose={handleOnCloseDialogColumns} columns={TABLE_HEAD} columnVisibility={columnVisibility} handleColumnVisibilityChange={handleColumnVisibilityChange} />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title={i18next.t('delete')}>
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD.filter((column)=>columnVisibility[column.id])}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <CVTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => {handleEditRow(row.id)}}
                        selectedColumns={columnVisibility}
                        setIsProfilSelected={setIsProfilSelected}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

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
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={i18next.t('delete')}
        content={
          <>
            {i18next.t('deleteConfirm')} <strong> {selected.length} </strong> {i18next.t('items')}
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            {i18next.t('delete')}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterSearch, filterRole, filterFirstDate,
  filterLastDate }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterSearch) {
    inputData = inputData.filter(
      (cv) => {
        return cv.id.toString().indexOf(filterSearch) !== -1 ||
        cv.firstName.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        cv.lastName.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        cv.lien.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        cv.localisation.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
      }
    );
  }

  return inputData;
}
