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
import { DatabaseTableToolbar, DatabaseTableRow } from '../../../sections/dashboard/database/list';
import { fDate } from '../../../utils/formatTime';
import i18next from 'i18next';
import { Stack } from '@mui/system';
import { AnalyticsCount } from '../../../sections/general/analytics';
import { DialogColumns } from '../../../components/segula-components';
import { useAuthContext } from '../../../auth/useAuthContext';
import { getConfigColumnFromList, setConfigColumnFromList } from '../../../utils/userTools';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';

// ----------------------------------------------------------------------
const LIST_ID = 'database';

const STATUS_OPTIONS = ['all'];

const ROLE_OPTIONS = [
  'all'
];

const TABLE_HEAD = [
  { id: 'id', label: i18next.t('id'), align: 'left' },
  { id: 'lib', label: "Libellé", align: 'left' },
  { id: 'customer', label: "Client", align: 'left' },
  { id: 'sector', label: "Secteur", align: 'left' },
  { id: 'cat', label: i18next.t('cat'), align: 'left' },
  { id: 'result', label: "Resultat", align: 'left' },
  { id: 'referent', label: "Referent", align: 'left' },
  { id: 'createdAt', label: i18next.t('createdAt'), align: 'left' },
  { id: 'updatedAt', label: i18next.t('updatedAt'), align: 'left' },
];

const excelTableHead = [i18next.t('id'), i18next.t('cat'), i18next.t('firstName'), i18next.t('lastName'), i18next.t('username'), i18next.t('email'), i18next.t('createdAt'), i18next.t('updatedAt'), ' ']
const excelFileName = i18next.t('excelName')

const databasesInitial = [
  {
    id: 1,
    lib: 'Managements des tests de roulage',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.',
    customer: 'Stellantis',
    sector: 'Automobile',
    cat: 'Developpement Software',
    result: 'Perdu',
    referent: 'Pierre Guizard',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 2,
    lib: 'Digitalisation des guides de maintenance des trains',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.',
    customer: 'Alstom',
    sector: 'Ferroviaire',
    cat: 'Developpement Software',
    result: 'Gagné',
    referent: 'Julien Fouth',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 3,
    lib: 'Visualisation d\'un conteneur d\'odorisation du gaz',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.',
    customer: 'GRDF',
    sector: 'Energie',
    cat: 'Developpement Software',
    result: 'Gagné',
    referent: 'Arnaud Barillec',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 4,
    lib: 'Suivi de la maintenance des hélicoptères',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.',
    customer: 'Airbus',
    sector: 'Aéronautique',
    cat: 'Developpement Software',
    result: 'Gagné',
    referent: 'Pierre Guizard',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 5,
    lib: 'Connectivités des voitures autonomes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.',
    customer: 'Stellantis',
    sector: 'Automobile',
    cat: 'Developpement Software Embarqué',
    result: 'Gagné',
    referent: 'Pierre Guizard',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
]

// ----------------------------------------------------------------------

export default function DatabaseListPage() {

  const { user } = useAuthContext();

  let columnConfig = getConfigColumnFromList(user, LIST_ID, TABLE_HEAD);

  const {presetsOption } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [seriesKpi, setSeriesKPI] = useState([]);
  const [seriesKpiTotal, setSeriesKPITotal] = useState(0);
  const [databases, setDatabases] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState(columnConfig);
  const [isShowColumnFilter, setIsShowColumnFilter] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
 

  useEffect(() => {
    const _resData = databasesInitial.map(
      ({ id, lib, customer, sector, cat, result, referent, createdAt, updatedAt }) => ({ id, lib, customer, sector, cat, result, referent, createdAt:fDate(createdAt),updatedAt:fDate(updatedAt)}));
    setTableData(_resData);
    const excelData = _resData.map(obj => {
      const { [Object.keys(obj).pop()]: prop, ...rest } = obj;
      return rest;
    });
    setExportData(excelData);

    let seriesTab = [];
    let kpis = {
      total: 241,
      cats: [
        {cat: 'Automobile', count: 150},
        {cat: 'Aéronautique', count: 27},
        {cat: 'Ferroviaire', count: 4},
        {cat: 'Energie', count: 60},
      ]
    }
    setSeriesKPITotal(kpis.total);
    kpis.cats.forEach(element => {
      seriesTab.push({label: i18next.t(element.cat), value: element.count})
    });
    setSeriesKPI(seriesTab);

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
    userService.deleteDatabase(id)
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
    //navigate(PATH_DASHBOARD.database.edit(paramCase(id.toString())));
    enqueueSnackbar('Vous ne pouvez pas editer les élèments', { variant: 'error' });
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
        <CustomBreadcrumbs
          heading={"Base de données"}
          links={[
            { name: i18next.t('general')},
            { name: "Base de données" },
          ]}
        />

        <Stack
          direction="row"
        >
          <Card sx={{ mb: 5, py: 2, mr: 2, minWidth:'20%' }}>
            <AnalyticsCount
              title="Total"
              total={seriesKpiTotal}
              percent={100}
              unity={(seriesKpiTotal>1)?"Projets":"Projet"}
              icon="ic:round-people-alt"
              color={theme.palette.kpi[0]} 
            />
          </Card>
          <Card sx={{ mb: 5, minWidth:'78%' }}>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                sx={{ py: 2 }}
              >
                {seriesKpi.map((serie, index) => {
                  let colors=theme.palette.kpi;
                  return (<AnalyticsCount
                    title={serie.label}
                    total={(serie.value!='')?serie.value:'0'}
                    percent={(serie.value/seriesKpiTotal)*100}
                    unity={(serie.value!='' && serie.value!='1')?"Projets":"Projet"}
                    color={colors[index+1]}
                  />)
                })}
        
              </Stack>
          </Card>
        </Stack>
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

          <DatabaseTableToolbar
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
                      <DatabaseTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => {handleEditRow(row.id)}}
                        selectedColumns={columnVisibility}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
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
      (database) => {
        return database.id.toString().indexOf(filterSearch) !== -1 ||
        database.lib.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        database.customer.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        database.sector.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        database.cat.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        database.result.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        database.referent.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(database.createdAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(database.updatedAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
      }
    );
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((database) => database.cat === i18next.t(filterRole));
  }

  if(filterFirstDate) {
    inputData = inputData.filter(
      (database) => new Date(database.createdAt) >= new Date(filterFirstDate)
    );
  }

  if(filterLastDate) {
    inputData = inputData.filter(
      (database) => new Date(database.createdAt) <= new Date((new Date(filterLastDate)).valueOf() + 1000*3600*24)
    );
  }

  return inputData;
}
