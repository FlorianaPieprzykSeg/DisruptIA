import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, InputAdornment, IconButton, Button, Divider, Tab, Tabs, AppBar, TextField, Typography, useTheme } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
} from '../../../components/hook-form';
import i18next from 'i18next';
import Iconify from '../../../components/iconify/Iconify';
import { TabPanel, UploadLayout } from '../../../components/segula-components';
import { FileCard, FileNewFolderDialog } from '../file';
import { DatePicker } from '@mui/x-date-pickers';
import CVListPage from '../../../components/segula-components/cv/CVListPage';
import FileSaver from 'file-saver';
import ConfirmDialog from '../../../components/confirm-dialog/ConfirmDialog';

// ----------------------------------------------------------------------

AorATForms.propTypes = {
  isEdit: PropTypes.bool,
  currentAor: PropTypes.object,
};

export default function AorATForms({ isEdit = false, currentAor }) {
  const categories = ['admin','dirGeneral','dirBranch','dirDivision','rbu'];
  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [openUploadFileSup, setOpenUploadFileSup] = useState(false);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [count, setCount] = useState(0);
  const [countSup, setCountSup] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isProfilSelected, setIsProfilSelected] = useState(false);

  const [isAfterGeneral, setIsAfterGeneral] = useState(false);
  const [openDialogConf, setOpenDialogConf] = useState(false);

  const theme = useTheme();

  const file = {
    name: 'TMT Tutorial',
    type: 'pptx',
    size: 2077,
    dateModified: 'Monday 24 July 2023 15:58:34',
    url: '/tutorial/TMT - tuto.pptx'
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
};

  //Handle procedure upload Dialog
  const handleOpenUploadFile = () => {
    setOpenUploadFile(true);
  };

  const handleCloseUploadFile = () => {
    setOpenUploadFile(false);
  }
  const handleSetUploaderInfo = (data, callback) => {
    setCount(count+1);
    enqueueSnackbar('Document Ajouté');
    handleCloseUploadFile();
  }

  //Handle procedure upload Dialog
  const handleOpenUploadFileSup = () => {
    setOpenUploadFileSup(true);
  };

  const handleCloseUploadFileSup = () => {
    setOpenUploadFileSup(false);
  }
  const handleSetUploaderInfoSup = (data, callback) => {
    setCountSup(countSup+1);
    enqueueSnackbar('Document Ajouté');
    handleCloseUploadFileSup();
  }

  const handleDownloadDocument = () => {
    FileSaver.saveAs('/cv/DossierCompétences_JDU.pdf', 'PTC');
  }
  
  const handleCloseConfirm = () => {
    setOpenDialogConf(false);
    setIsAfterGeneral(true);
  };

  const NewAorSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      lib: currentAor?.lib || '',
      type: currentAor?.type || '',
      customer: currentAor?.customer || '',
      sector: currentAor?.sector || '',
      cat: currentAor?.cat || '',
      localisation: currentAor?.localisation || '',
      tjm: currentAor?.tjm || '',
      referent: currentAor?.referent || '',
      referentCustomer: currentAor?.referentCustomer || '',
      proba: currentAor?.proba || '',
      statut: currentAor?.statut || '',
      duree: currentAor?.duree || '',
    }),
    [currentAor]
  );;

  const methods = useForm({
    resolver: yupResolver(NewAorSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
    if(currentAor && currentAor.echeance) {
      setDate(new Date(currentAor.echeance))
    }
  }, [isEdit, currentAor]);

  const onSubmit = async (data) => {
    enqueueSnackbar('Nouveau RAO ajouté avec succès!');
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
          <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="tabs section"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                  bgcolor: 'background.neutral',
                  width: '100%'
              }}>
              <Box 
                  sx={{
                      mr: 4,
                  }}
                  onClick={() => setTabValue(0)}
              >
                  <Tab
                      label={
                          <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                              General
                          </Box>
                      }
                  />
              </Box>
              {isAfterGeneral && (
                <Box 
                    sx={{
                        mr: 4,
                    }}
                    onClick={() => setTabValue(1)}
                >
                    <Tab
                        label={
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                                Profils - CV
                            </Box>
                        }
                    />
                </Box>
              )}
              {isProfilSelected && (
                <Box 
                    sx={{
                        mr: 4,
                    }}
                    onClick={() => setTabValue(2)}
                >
                    <Tab
                        label={
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                                PTC
                            </Box>
                        }
                    />
                </Box>
              )}
          </Tabs>
      </AppBar>

      <Divider></Divider>

      <TabPanel value={tabValue} index={0}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={10}>
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <UploadLayout isEdit={isEdit} handleOpenUploadFile={handleOpenUploadFile} countDoc={1} field={'aor'} title={"RAO"}/>
                  <UploadLayout isEdit={isEdit} handleOpenUploadFile={handleOpenUploadFile} countDoc={1} field={'aor'} title={"Documents Additionnels"}/>
                  <Grid xs={12} md={10}/>
                  <Grid xs={12} md={10}/>
                  <Divider />
                  <Divider />
                  <RHFTextField name="lib" label="Libellé"/>
                  <RHFAutocomplete
                      name="type"
                      label={"Type"}
                      options={['AT', 'Work Package']}
                      disabled
                  />
                  <RHFTextField name="customer" label="Client"/>
                  <Grid xs={12} md={10}/>
                  <RHFAutocomplete
                      name="sector"
                      label={"Secteur"}
                      options={["Automobile", "Ferroviaire", "Aéronautique", "Energie"]}
                  />
                  <RHFAutocomplete
                      name="cat"
                      label={"Catégorie"}
                      options={["Developpement Software", "Developpement Software Embarqué"]}
                  />
                  <RHFTextField name="localisation" label="Localisation"/>
                  <RHFTextField name="tjm" label="TJM"/>
                  <RHFTextField name="referent" label="Referent Interne" />
                  <RHFTextField name="referentCustomer" label="Contact Client" />
                  <RHFTextField name="proba" label="Probabilité de Gain" disabled sx={{ background: theme.palette.action.disabledBackground, borderRadius: 1}}/>
                  <RHFTextField name="statut" label="Statut" />
                  <RHFTextField
                      name="duree"
                      label="Durée"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box component="span" sx={{ color: 'grey.400' }}>
                              days
                            </Box>
                          </InputAdornment>
                        ),
                        type: 'number',
                      }}
                  />
                  <DatePicker
                    name="echeance"
                    label="Date Cible"
                    value={date}
                    renderInput={(params) => (
                      <RHFTextField
                        {...params}
                        fullWidth
                      />
                    )}
                  />
                  <RHFTextField name="description" label="Description du besoin" multiline value={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel tellus vitae neque dapibus ultrices. Cras interdum sagittis ultrices. Aliquam vitae dolor ac purus sollicitudin convallis. Etiam ipsum urna, fermentum tempus porttitor nec, gravida eget tellus. In ut ante mauris. Sed interdum tortor sit amet vestibulum lobortis."}/>
                  <RHFTextField name="skill" label="Compétences Clés" value={"Javascript / Express / Python / mySQL"}/>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <Box
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'auto auto',
                      }}
                  >
                    <Link to='/dashboard/aor/list' style={{ textDecoration: 'none' }}><Button variant="contained">{i18next.t('cancel')}</Button></Link>
                    <LoadingButton variant="contained" onClick={() => (setOpenDialogConf(true))}>
                      {"Valider les données"}
                    </LoadingButton>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <FileNewFolderDialog isCreate={!isEdit} open={openUploadFile} onClose={handleCloseUploadFile} entity='aor' field='aor' documentsToAdd={{}} documentsToShow={{}} setUploaderInfo={handleSetUploaderInfo}/>
            <FileNewFolderDialog isCreate={!isEdit} open={openUploadFileSup} onClose={handleCloseUploadFileSup} entity='aor' field='aor' documentsToAdd={{}} documentsToShow={{}} setUploaderInfo={handleSetUploaderInfoSup}/>
          </Grid>
        </FormProvider>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {isProfilSelected && (
          <>
          <Stack direction={"row"}>
            <TextField name="cv" label="Profil Selectionné" sx={{ mb: 5, ml: 3 }} value={"Jean Dupré"} InputLabelProps={{ shrink: true }} />
            <IconButton sx={{ mb: 5, ml: 1 }}>
              <Iconify icon="eva:download-fill" color={'success.main'} />
            </IconButton>
          </Stack>
          <Divider sx={{mb:5}}/>
          </>
        )}
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill"/>}
          sx={{ mb: 2, ml: 3 }}
        >
          {"Nouveau Profil"}
        </Button>
        <CVListPage setIsProfilSelected={setIsProfilSelected}/>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
      <FormProvider methods={methods}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={10}>
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <DatePicker
                    name="start"
                    label="Date Debut"
                    renderInput={(params) => (
                      <RHFTextField
                        {...params}
                        fullWidth
                      />
                    )}
                  />
                  <DatePicker
                    name="end"
                    label="Date Fin"
                    renderInput={(params) => (
                      <RHFTextField
                        {...params}
                        fullWidth
                      />
                    )}
                  />
                  <Divider />
                  <Divider />
                  <Typography variant='h6'>
                    Données generales:
                  </Typography>
                  <Grid xs={12} md={10}/>
                  <RHFTextField name="lib" label="Libellé"/>
                  <RHFAutocomplete
                      name="type"
                      label={"Type"}
                      options={['AT', 'Work Package']}
                  />
                  <RHFTextField name="customer" label="Client"/>
                  <Grid xs={12} md={10}/>
                  <RHFAutocomplete
                      name="sector"
                      label={"Secteur"}
                      options={["Automobile", "Ferroviaire", "Aéronautique", "Energie"]}
                  />
                  <RHFAutocomplete
                      name="cat"
                      label={"Catégorie"}
                      options={["Developpement Software", "Developpement Software Embarqué"]}
                  />
                  <RHFTextField name="localisation" label="Localisation"/>
                  <RHFTextField name="tjm" label="TJM"/>
                  <RHFTextField name="referent" label="Referent Interne" />
                  <RHFTextField name="referentCustomer" label="Contact Client" />
                  <RHFTextField
                      name="duree"
                      label="Durée"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box component="span" sx={{ color: 'grey.400' }}>
                              days
                            </Box>
                          </InputAdornment>
                        ),
                        type: 'number',
                      }}
                  />
                  <DatePicker
                    name="echeance"
                    label="Date Cible"
                    value={date}
                    renderInput={(params) => (
                      <RHFTextField
                        {...params}
                        fullWidth
                      />
                    )}
                  />
                  <RHFTextField name="description" label="Description du besoin" multiline value={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel tellus vitae neque dapibus ultrices. Cras interdum sagittis ultrices. Aliquam vitae dolor ac purus sollicitudin convallis. Etiam ipsum urna, fermentum tempus porttitor nec, gravida eget tellus. In ut ante mauris. Sed interdum tortor sit amet vestibulum lobortis."}/>
                  <RHFTextField name="skill" label="Compétences Clés" value={"Javascript / Express / Python / mySQL"}/>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <Box
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'auto auto',
                      }}
                  >
                    <LoadingButton variant="contained" loading={isSubmitting} onClick={handleDownloadDocument}>
                      {"Generer le PTC"}
                    </LoadingButton>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <FileNewFolderDialog isCreate={!isEdit} open={openUploadFile} onClose={handleCloseUploadFile} entity='aor' field='aor' documentsToAdd={{}} documentsToShow={{}} setUploaderInfo={handleSetUploaderInfo}/>
            <FileNewFolderDialog isCreate={!isEdit} open={openUploadFileSup} onClose={handleCloseUploadFileSup} entity='aor' field='aor' documentsToAdd={{}} documentsToShow={{}} setUploaderInfo={handleSetUploaderInfoSup}/>
          </Grid>
        </FormProvider>
      </TabPanel>
      <ConfirmDialog
        open={openDialogConf}
        onClose={() => (setOpenDialogConf(false))}
        title={"Valider les données"}
        content={
            'Voulez vous valider les données remplies ? Cela vous donnera accès à de nouveaux onglets'
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleCloseConfirm();
            }}
          >
            Valider les données
          </Button>
        }
      />
    </Box>
  );
}
