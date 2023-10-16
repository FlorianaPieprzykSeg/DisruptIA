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
import { AorTableToolbar, AorTableRow } from '../../../sections/dashboard/aor/list';
import { fDate } from '../../../utils/formatTime';
import i18next from 'i18next';
import { Stack } from '@mui/system';
import { AnalyticsCount } from '../../../sections/general/analytics';
import { DialogColumns } from '../../../components/segula-components';
import { useAuthContext } from '../../../auth/useAuthContext';
import { getConfigColumnFromList, setConfigColumnFromList } from '../../../utils/userTools';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------
const LIST_ID = 'aor';

const STATUS_OPTIONS = ['all'];

const ROLE_OPTIONS = [
  'all'
];

const TABLE_HEAD = [
  { id: 'id', label: i18next.t('id'), align: 'left' },
  { id: 'lib', label: "Libellé", align: 'left' },
  { id: 'type', label: "Type", align: 'left' },
  { id: 'statut', label: "Statut", align: 'left' },
  { id: 'customer', label: "Client", align: 'left' },
  { id: 'sector', label: "Secteur", align: 'left' },
  { id: 'cat', label: i18next.t('cat'), align: 'left' },
  { id: 'localisation', label: "Localisation", align: 'left' },
  { id: 'skills', label: "Compétences", align: 'left' },
  { id: 'tjm', label: "TJM", align: 'left' },
  { id: 'echeance', label: "Date cible", align: 'left' },
  { id: 'duree', label: "Durée", align: 'left' },
  { id: 'proba', label: "Probabilité de gain", align: 'left' },
  { id: 'referent', label: "Referent Interne", align: 'left' },
  { id: 'referentCustomer', label: "Contact Client", align: 'left' },
  { id: 'docs', label: "Pièces Jointes", align: 'left' },
  { id: 'createdAt', label: i18next.t('createdAt'), align: 'left' },
  { id: 'updatedAt', label: i18next.t('updatedAt'), align: 'left' },
  { id: '', label: ''},
];

const excelTableHead = [i18next.t('id'), i18next.t('cat'), i18next.t('firstName'), i18next.t('lastName'), i18next.t('username'), i18next.t('email'), i18next.t('createdAt'), i18next.t('updatedAt'), ' ']
const excelFileName = i18next.t('excelName')

const aorsInitial = [
  {
    id: 1,
    lib: 'Managements des tests de roulage',
    type: 'AT',
    customer: 'Stellantis',
    sector: 'Automobile',
    cat: 'Developpement Software',
    localisation: 'Trappes',
    tjm: '420',
    referent: 'Pierre Guizard',
    referentCustomer: 'Nancy DuPont',
    proba: 50,
    statut: 'Accepté',
    echeance: '2022-08-23T16:50:22-07:00',
    duree: 30,
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id:2,
    lib: 'Fonctionnement Conteneur Odorisation Gaz',
    type: 'WP',
    customer: 'GRDF',
    sector: 'Energie',
    cat: 'Developpement Software / réalité augmentée / Developpement iOS',
    localisation: 'Trappes',
    tjm: 'NA',
    referent: 'Aurélie FORT',
    referentCustomer: 'Emilie BAILLART',
    proba: 42,
    statut: 'Accepté',
    duree: 'NA',
    echeance: '2022-08-23T16:50:22-07:00',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 3,
    lib: 'PO Digital',
    type: 'AT',
    customer: 'Renault',
    sector: 'Automobile',
    cat: 'Product Owner / chef de projet / digital',
    localisation: 'Guyancourt',
    tjm: '450',
    referent: 'Florence BEAUFRERE',
    referentCustomer: 'Phillipe BELTRADE',
    proba: 68,
    statut: 'Accepté',
    duree: 90,
    echeance: '2022-08-23T16:50:22-07:00',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 4,
    lib: 'Formateur sureté de fonctionnement',
    type: 'AT',
    customer: 'Stellantis',
    sector: 'Automobile',
    cat: 'SDF / formation',
    localisation: 'Velizy',
    tjm: '400',
    referent: 'Florence BEAUFRERE',
    referentCustomer: 'David DUVAL',
    proba: 15,
    statut: 'Refusé',
    duree: 30,
    echeance: '2022-08-23T16:50:22-07:00',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 5,
    lib: 'Visualisation des produits de la société en numérique',
    type: 'WP',
    customer: 'Mirion',
    sector: 'Nucléaire',
    cat: 'Developpement Software / 3D / Developpement iOS',
    localisation: 'Trappes',
    tjm: 'NA',
    referent: 'Aurélie FORT',
    referentCustomer: 'Frederic FORGASSE',
    proba: 37,
    statut: 'Accepté',
    duree: 'NA',
    echeance: '2022-08-23T16:50:22-07:00',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 6,
    lib: 'Retrofit projet ST458',
    type: 'WP',
    customer: 'Mercedes',
    sector: 'Automobile',
    cat: 'mécanique / automobile / electronique / IHM / batterie',
    localisation: 'Trappes',
    tjm: 'NA',
    referent: 'Julien FOUTH',
    referentCustomer: 'Christian CURIOZO',
    proba: 81,
    statut: 'Accepté',
    duree: 'NA',
    echeance: '2022-08-23T16:50:22-07:00',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 7,
    lib: 'Developpeur C++',
    type: 'AT',
    customer: 'Valeo',
    sector: 'Automobile',
    cat: 'Developpement Software ',
    localisation: 'Rambouillet',
    tjm: '380',
    referent: 'Pierre GUIZARD',
    referentCustomer: 'Clément PERARE',
    proba: 41,
    statut: 'Accepté',
    duree: 150,
    echeance: '2022-08-23T16:50:22-07:00',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 8,
    lib: 'Trains Connectés',
    type: 'WP',
    customer: 'SNCF',
    sector: 'Ferroviere',
    cat: 'Developpement Software / Developpement embarqué / electronique',
    localisation: 'Trappes',
    tjm: 'NA',
    referent: 'ADAM HOUENOU',
    referentCustomer: 'Lara CROFT',
    proba: 29,
    statut: 'Accepté',
    duree: 'NA',
    echeance: '2022-08-23T16:50:22-07:00',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 9,
    lib: 'Rédaction de CDC',
    type: 'AT',
    customer: 'Aiirbus',
    sector: 'Aeronautique',
    cat: 'Developpement Embarqué / Ux',
    localisation: 'Saint Nazaire',
    tjm: '400',
    referent: 'Florence BEAUFRERE',
    referentCustomer: 'Jade ECLAES',
    proba: 91,
    statut: 'Accepté',
    duree: 30,
    echeance: '2022-08-23T16:50:22-07:00',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 10,
    lib: 'Mise en place d\'une Software Facrory',
    type: 'WP',
    customer: 'Thales',
    sector: 'Armement',
    cat: 'Developpement Software',
    localisation: 'Trappes',
    tjm: 'NA',
    referent: 'Aurélie FORT',
    referentCustomer: 'Jonathan FRICSOR',
    proba: 59,
    statut: 'Accepté',
    duree: 'NA',
    echeance: '2022-08-23T16:50:22-07:00',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
]

// ----------------------------------------------------------------------

export default function AorListPage() {

  const { user } = useAuthContext();

  let columnConfig = getConfigColumnFromList(user, LIST_ID, TABLE_HEAD);

  const {presetsOption } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [seriesKpi, setSeriesKPI] = useState([]);
  const [seriesKpiTotal, setSeriesKPITotal] = useState(0);
  const [aors, setAors] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState(columnConfig);
  const [isShowColumnFilter, setIsShowColumnFilter] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
 

  useEffect(() => {
    const _resData = aorsInitial.map(
      ({ id, lib, type, customer, sector, cat, localisation, tjm, referent, referentCustomer, proba, statut, echeance, duree, createdAt, updatedAt }) => ({ id, lib, type, customer, sector, cat, localisation, tjm, referent, referentCustomer, proba, statut, echeance:fDate(echeance), duree, createdAt:fDate(createdAt),updatedAt:fDate(updatedAt)}));
    setTableData(_resData);
    const excelData = _resData.map(obj => {
      const { [Object.keys(obj).pop()]: prop, ...rest } = obj;
      return rest;
    });
    setExportData(excelData);

    let seriesTab = [];
    let kpis = {
      total: 272,
      cats: [
        {cat: 'AT', count: 204},
        {cat: 'WorkPackage', count: 68},
        {cat: 'Publique', count: 147},
        {cat: 'Privé', count: 125},
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
    userService.deleteAor(id)
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
    //navigate(PATH_DASHBOARD.aor.edit(paramCase(id.toString())));
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
          heading={"Liste des RAOs"}
          links={[
            { name: i18next.t('general')},
            { name: "Liste des RAOs" },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              {"Nouveau RAO"}
            </Button>
          }
        />

        <Stack
          direction="row"
        >
          <Card sx={{ mb: 5, py: 2, mr: 2, minWidth:'20%' }}>
            <AnalyticsCount
              title="Total"
              total={seriesKpiTotal}
              percent={100}
              unity={(seriesKpiTotal>1)?"RAOs":"RAO"}
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
                    unity={(serie.value!='' && serie.value!='1')?"RAOs":"RAO"}
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

          <AorTableToolbar
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
                      <AorTableRow
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
      (aor) => {
        return aor.id.toString().indexOf(filterSearch) !== -1 ||
        aor.lib.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        aor.type.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        aor.customer.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        aor.sector.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        aor.cat.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        aor.tjm.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        aor.referent.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        aor.referentCustomer.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        aor.proba.toString().toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        aor.statut.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(aor.echeance).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(aor.duree).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(aor.createdAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(aor.updatedAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
      }
    );
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((aor) => aor.cat === i18next.t(filterRole));
  }

  if(filterFirstDate) {
    inputData = inputData.filter(
      (aor) => new Date(aor.createdAt) >= new Date(filterFirstDate)
    );
  }

  if(filterLastDate) {
    inputData = inputData.filter(
      (aor) => new Date(aor.createdAt) <= new Date((new Date(filterLastDate)).valueOf() + 1000*3600*24)
    );
  }

  return inputData;
}
