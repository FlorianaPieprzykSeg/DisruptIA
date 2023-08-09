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
import Scrollbar from '../../../components/scrollbar';
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
import { UserTableToolbar, UserTableRow } from '../../../sections/dashboard/user/list';
import { fDate } from '../../../utils/formatTime';
import i18next from 'i18next';
import { Stack } from '@mui/system';
import { AnalyticsCount } from '../../../sections/general/analytics';
import { DialogColumns } from '../../../components/segula-components';
import { useAuthContext } from '../../../auth/useAuthContext';
import { getConfigColumnFromList, setConfigColumnFromList } from '../../../utils/userTools';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';

// ----------------------------------------------------------------------
const LIST_ID = 'user';

const STATUS_OPTIONS = ['all'];

const ROLE_OPTIONS = [
  'all',
  'admin',
  'dirGeneral',
  'dirBranch',
  'dirPole',
  'rbu'
];

const TABLE_HEAD = [
  { id: 'id', label: i18next.t('id'), align: 'left' },
  { id: 'cat', label: i18next.t('cat'), align: 'left' },
  { id: 'firstName', label: i18next.t('firstName'), align: 'left' },
  { id: 'lastName', label: i18next.t('lastName'), align: 'left' },
  { id: 'username', label: i18next.t('username'), align: 'left' },
  { id: 'email', label: i18next.t('email'), align: 'left' },
  { id: 'createdAt', label: i18next.t('createdAt'), align: 'left' },
  { id: 'updatedAt', label: i18next.t('updatedAt'), align: 'left' },
  { id: 'actions' , label: ''},
];

const excelTableHead = [i18next.t('id'), i18next.t('cat'), i18next.t('firstName'), i18next.t('lastName'), i18next.t('username'), i18next.t('email'), i18next.t('createdAt'), i18next.t('updatedAt'), ' ']
const excelFileName = i18next.t('excelName')

const usersInitial = [
  {
    id: 1,
    cat: 'admin',
    firstName: 'Segula',
    lastName: 'Team',
    username: 'Segula_Team',
    password: 'Segula_Team',
    email: 'Segula_Team@Segula.team',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 2,
    cat: 'dirGeneral',
    firstName: 'Director',
    lastName: 'General',
    username: 'director_General',
    password: 'director_General',
    email: 'director_General@director.general',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 4,
    cat: 'dirBranch',
    firstName: 'Director',
    lastName: 'Branch',
    username: 'director_Branch',
    password: 'director_Branch',
    email: 'director_Branch@director.branch',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 5,
    cat: 'dirPole',
    firstName: 'Director',
    lastName: 'Pole',
    username: 'director_Pole',
    password: 'director_Pole',
    email: 'director_Pole@director.pole',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
  {
    id: 6,
    cat: 'rbu',
    firstName: 'RBU',
    lastName: 'RBU',
    username: 'rbu',
    password: 'rbu',
    email: 'rbu@rbu.rbu',
    createdAt: '2022-08-23T16:50:22-07:00',
    updatedAt: '2022-08-23T16:50:22-07:00'
  },
]

// ----------------------------------------------------------------------

export default function UserListPage() {

  const { user } = useAuthContext();

  let columnConfig = getConfigColumnFromList(user, LIST_ID, TABLE_HEAD);

  const {presetsOption } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [seriesKpi, setSeriesKPI] = useState([]);
  const [seriesKpiTotal, setSeriesKPITotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState(columnConfig);
  const [isShowColumnFilter, setIsShowColumnFilter] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleSwitchAvatarUrl = (cat)=> {
    switch(cat) {
      case "admin":
        return("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_11.jpg");
        break;
      case "dirGeneral":
        return("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_18.jpg");
        break;
      case "dirBranch":
        return("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_23.jpg");
        break;
      case "dirPole":
        return("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_24.jpg");
        break;
      case "rbu":
        return("https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_2.jpg");
        break;
      default:
        return("");
    }
    
  }
 

  useEffect(() => {
    const _resData = usersInitial.map(
      ({ id, cat, firstName, lastName, username,email,createdAt,updatedAt,avatarUrl }) => ({ id, cat:i18next.t(cat), firstName, lastName, username,email,createdAt:fDate(createdAt),updatedAt:fDate(updatedAt),avatarUrl:handleSwitchAvatarUrl(cat)}));
    setTableData(_resData);
    const excelData = _resData.map(obj => {
      const { [Object.keys(obj).pop()]: prop, ...rest } = obj;
      return rest;
    });
    setExportData(excelData);

    let seriesTab = [];
    let kpis = {
      total: 5,
      cats: [
        {cat: 'admin', count: 1},
        {cat: 'dirGeneral', count: 1},
        {cat: 'dirBranch', count: 1},
        {cat: 'dirPole', count: 1},
        {cat: 'rbu', count: 1}
      ]
    }
    setSeriesKPITotal(kpis.total);
    kpis.cats.forEach(element => {
      seriesTab.push({label: i18next.t(element.cat), value: element.count})
    });
    setSeriesKPI(seriesTab);
    /*userService.getAllUsers().then(
        res => {
            handleSwitchAvatarUrl(res.data.cat)
            const _resData = res.data.map(
              ({ id, cat, firstName, laastName, username,email,createdAt,updatedAt,avatarUrl }) => ({ id, cat:i18next.t(cat.toLowerCase()), firstName, laastName, username,email,createdAt:fDate(createdAt),updatedAt:fDate(updatedAt),avatarUrl:handleSwitchAvatarUrl(cat)}));
            setTableData(_resData);
            const excelData = _resData.map(obj => {
              const { [Object.keys(obj).pop()]: prop, ...rest } = obj;
              return rest;
            });
            setExportData(excelData)
        }
    ).catch(err => {
        console.log(err);
    })
    //set values for KPIs
    userService.getUsersKPI().then(
      res => {
        let seriesTab = [];
        setSeriesKPITotal(res.data.total);
        res.data.cats.forEach(element => {
          seriesTab.push({label: i18next.t(element.cat.toLowerCase()), value: element.count})
        });
        setSeriesKPI(seriesTab);
      }
    ).catch(err => {
        console.log(err);
    })*/

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
    userService.deleteUser(id)
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
    navigate(PATH_DASHBOARD.user.edit(paramCase(id.toString())));
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
          heading={i18next.t('usersList')}
          links={[
            { name: i18next.t('settings')},
            { name: i18next.t('usersList') },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              {i18next.t('newUser')}
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
              unity={(seriesKpiTotal>1)?i18next.t('users'):i18next.t('user')}
              icon="ic:round-people-alt"
              color={theme.palette.kpi[0]} 
            />
          </Card>
        </Stack>

        <Card sx={{ mb: 5, minWidth:'78%' }}>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                sx={{ py: 2 }}
              >
                {seriesKpi.map((serie, index) => {
                  //define avatar
                  let srcAvatar = '';
                  if(serie.label == 'Administrateur'){
                    srcAvatar="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_11.jpg";
                  } else if(serie.label == 'Directeur Général'){
                    srcAvatar="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_18.jpg";
                  } else if(serie.label == 'Directeur Branche'){
                    srcAvatar="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_23.jpg";
                  } else if(serie.label == 'Directeur Pole'){
                    srcAvatar="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_24.jpg";
                  } else if(serie.label == 'RBU'){
                    srcAvatar="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_2.jpg";
                  }

                  let colors=theme.palette.kpi;
                  return (<AnalyticsCount
                    title={serie.label}
                    total={(serie.value!='')?serie.value:'0'}
                    percent={(serie.value/seriesKpiTotal)*100}
                    unity={(serie.value!='' && serie.value!='1')?i18next.t('users'):i18next.t('user')}
                    avatar={srcAvatar}
                    color={colors[index+1]}
                  />)
                })}
        
              </Stack>
          </Card>
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

          <UserTableToolbar
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
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => {handleEditRow(row.id)}}
                        selectedColumns={columnVisibility}
                        avatarUrl={avatarUrl}
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
      (user) => {
        let email = (user.email)?user.email:'';
        return user.id.toString().indexOf(filterSearch) !== -1 ||
        user.cat.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        user.firstName.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        user.username.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        email.toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(user.createdAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1 ||
        fDate(user.updatedAt).toLowerCase().indexOf(filterSearch.toLowerCase()) !== -1
      }
    );
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((user) => user.cat === i18next.t(filterRole));
  }

  if(filterFirstDate) {
    inputData = inputData.filter(
      (user) => new Date(user.createdAt) >= new Date(filterFirstDate)
    );
  }

  if(filterLastDate) {
    inputData = inputData.filter(
      (user) => new Date(user.createdAt) <= new Date((new Date(filterLastDate)).valueOf() + 1000*3600*24)
    );
  }

  return inputData;
}
