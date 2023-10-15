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
import RaoSimiListPage from '../../../components/segula-components/raoPrevious/RaoSimiListPage';
import ConfirmDialog from '../../../components/confirm-dialog/ConfirmDialog';

// ----------------------------------------------------------------------

AorWPForms.propTypes = {
  isEdit: PropTypes.bool,
  currentAor: PropTypes.object,
};

export default function AorWPForms({ isEdit = false, currentAor }) {
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
  const theme = useTheme();

  const [isAfterGeneral, setIsAfterGeneral] = useState(false);
  const [openDialogConf, setOpenDialogConf] = useState(false);
  const [isAfterReview, setIsAfterReview] = useState(false);
  const [openDialogConfGo, setOpenDialogConfGo] = useState(false);


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
    FileSaver.saveAs('/cv/DossierCompétences_JDU.pdf', 'RAO');
  }

  const handleCloseConfirm = () => {
    setOpenDialogConf(false);
    setIsAfterGeneral(true);
  };

  const handleCloseConfirmGo = () => {
    setOpenDialogConfGo(false);
    setIsAfterReview(true);
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
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
    if(currentAor && currentAor.echeance) {
      setDate(new Date(currentAor.echeance))
    }
  }, [isEdit, currentAor]);

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
                    label={<Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                      RAO Similaires
                    </Box>} />
                </Box>
              )}
              {isAfterGeneral && (
                <Box
                  sx={{
                    mr: 4,
                  }}
                  onClick={() => setTabValue(2)}
                >
                <Tab
                  label={<Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                    Revue Commerciale
                  </Box>} />
                </Box>
              )}
              {isAfterReview && (
                <Box
                  sx={{
                    mr: 4,
                  }}
                  onClick={() => setTabValue(3)}
                >
                  <Tab
                    label={<Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                      Rédaction d'Offre
                    </Box>} />
                </Box>
              )}
          </Tabs>
      </AppBar>

      <Divider></Divider>

      <TabPanel value={tabValue} index={0}>
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
                      options={['WP', 'Work Package']}
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
                  <RHFTextField name="referent" label="Referent Interne" />
                  <RHFTextField name="referentCustomer" label="Contact Client" />
                  <RHFTextField name="proba" label="Probabilité de Gain" disabled sx={{ background: theme.palette.action.disabledBackground, borderRadius: 1}}/>
                  <RHFTextField name="statut" label="Statut" />
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
        <RaoSimiListPage/>
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
                  <RHFTextField name="pilote" label="Pilote de l'offre" value={"Julien Fouth"}/>
                  <RHFTextField name="customer" label="Customer"/>
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
                  <Grid xs={12} md={10}/>
                  <Divider />
                  <Divider />
                  <Typography variant='h6'>
                    Synthèse RAO:
                  </Typography>
                  <Grid xs={12} md={10}/>
                  <RHFTextField name="lib" label="Libellé"/>
                  <Grid xs={12} md={10}/>
                  <DatePicker
                    name="dateStart"
                    label="Date prévisionnelle de démarrage"
                    value={new Date()}
                    renderInput={(params) => (
                      <RHFTextField
                        {...params}
                        fullWidth
                      />
                    )}
                  />
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
                  <RHFTextField name="descriptionPerimetre" label="Description et périmètre de la prestation" multiline value='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in rutrum mauris, nec vestibulum mauris. Quisque ac suscipit lacus, in ornare risus. Ut erat est, blandit nec risus in, auctor vehicula sapien.'/>
                  <RHFTextField name="context" label="Contexte et enjeux strategique" multiline value='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in rutrum mauris, nec vestibulum mauris. Quisque ac suscipit lacus, in ornare risus. Ut erat est, blandit nec risus in, auctor vehicula sapien.'/>
                  <Divider />
                  <Divider />
                  <Typography variant='h6'>
                    Evaluation des risques:
                  </Typography>
                  <Grid xs={12} md={10}/>
                  <RHFAutocomplete
                      name="connaissanceClient"
                      label={"Connaissance du client et Exigence"}
                      options={["1 - Client habituel, clair et non exigent", "2 - Client habituel non clair mais non exigent", "3 - Client usuel non clair et exigent", "4 - Nouveau client avec exigences claires et définies", "5 - Nouveau client avec exigences non claires"]}
                  />
                  <RHFAutocomplete
                      name="delai"
                      label={"Délai et faisabilité de l'offre"}
                      options={["1 - Chiffrage au temps passé avec des taux négociés", "2 - Chiffrage avec retour d'éxperience maitrisé ou complexe mais avec délai de remise d'offre éloigné", "3 - Chiffrage monométier sur périmètre nouveau à effectuer dans l'urgence", "4 - Chiffrage multi métier à réaliser dans l'urgence sur des sujets non maitrisés", "5 - Chiffrage avec de la sous traitance à effectuer dans l'urgence"]}
                  />
                  <RHFAutocomplete
                      name="charge"
                      label={"Charge et compétences à l'ouverture du dossier"}
                      options={["1 - Personnels aptes à répondre au besoin client disponibles et expérimentés", "2 - Personnels disponibles pour répondre au besoin client, peu experimentés mais encadrement disponible experimenté", "3 - Requiert le remplacement de personnels en interne sur des projets tiers, pour répondre au besoin client", "4 - Encadrement expérimenté requis, disponible avec délai d'attente, sous réserve d'acceptation du client & nécessité d'une méthode de qualification de l'intervenant (Tutorat formalisé)", "5 - Pas de capacité interne possible pour répondre"]}
                  />
                  <RHFAutocomplete
                      name="concu"
                      label={"Niveau de concurrence et Prix marché"}
                      options={["1 - Concurrence faible ou maitrisée", "2 - Prix marché attendu par le client, cohérent selon notre retour d'experience", "3 - Pas de différenciation concurrentielle à mettre en avant", "4 - Forte concurrence sur le marché et désavantage concurrentiel existant", "5 - Forte concurrence déjà bien implantée sur le marché OU absence de référence à présenter"]}
                  />
                  <RHFAutocomplete
                      name="projets"
                      label={"Projets multu-métiers"}
                      options={["1 - Projet à réaliser par une seule entité: BU ou Pôle, ne faisant pas appel à un métier transverse et réalisé en autonomie complète", "2 - Projet à réaliser par une seule entité avec cession de compétence tierce ou appel à un métier transverse", "3 - Projet nécessitant le recrutement de compétence exterieure", "4 - Projet multi métier avec périmètres définis et sans interactions", "5 - Projet multi métier nécessitant une coordination pour convergence"]}
                  />
                  <RHFAutocomplete
                      name="Compréhension / Clarté du CdC"
                      label={"Connaissance du client et Exigence"}
                      options={["1 - Cdc type avec périmètre d'intervention clair et délimité", "2 - CdC type avec des compléments particuliers inhabiyuels: Amdec, analyse fonctionnelle...", "3 - CdC comportant des sujets non maitrisés et nécessitant des questions complémentaires", "4 - CdC nécessitant un délai d'appropriation et de réponse élaboré", "5 - CdC requèrant des métiers, matières ou techniques novateurs"]}
                  />
                  <RHFAutocomplete
                      name="livraison"
                      label={"Délai de livraison requis"}
                      options={["1 - Délai de livraison large et sans risque selon notre retour d'experience", "2 - Délai de livraison incluant des dérives internes potentielles", "3 - Délai avec une légère dérive éventuelle des livrables admissible par le client", "4 - Délai sans aucune possibilité de dérive car sans marge de manoeuvre du client", "5 - Délai non compatible avec les délais internes usuels"]}
                  />
                  <RHFAutocomplete
                      name="sourcing"
                      label={"Si sourcing, état du marché de l'emploi"}
                      options={["1 - Compétences disponibles dans le vivier", "2 - Compétence disponibles sur le marché", "3 - Compétences rares sur le marché mais repositionnement en interne possible", "4 - Compétences rares et reposionnement difficile en interne", "5 - Compétence introuvables sur le marché"]}
                  />
                  <RHFAutocomplete
                      name="sousTraitance"
                      label={"Sous Traitance"}
                      options={["1 - Projet ne nécessitant aucun retour à la sous traitance", "2 - Projet nécessitant appel à sous traitance connue et fiable, disponible", "3 - Projet nécessitant appel à sous traitance usuelle incontournable", "4 - Projet nécessitant appel à sous traitance nouvelle sur le marché concurrentiel connu", "5 - Projet nécessitant appel à sous traitance inconnue sur le marché méconnu"]}
                  />
                  <RHFAutocomplete
                      name="retour"
                      label={"Retour d'expérience existant"}
                      options={["1 - Projets similaires réalisés avec personnel ayant déjà participé au projet précédant, disponible", "2 - Projets similaires réalisés, mais avec fort turn over du personnel depuis lors", "3 - Projet similaire réalisé une seule fois avec capitabisation d'experience non maitrisée", "4 - Projet similaire déjà effectué mais sans possibilité de récupérer la capitalisation d'expérience précédente", "5 - Nouveau projet jamais réalisé"]}
                  />
                  <Grid xs={12} md={10}/>
                  <Grid xs={12} md={10}/>
                  <Divider />
                  <Divider />
                  <Typography textAlign={'center'} variant='subtitle1'>
                    Note IA Go/NoGo : 
                  </Typography>
                  <Typography textAlign={'center'} variant='subtitle1' color={'success.main'}>
                    21/50
                  </Typography>
                  <Grid xs={12} md={10}/>
                  <Grid xs={12} md={10}/>
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
                    <Link to='/dashboard/aor/list' style={{ textDecoration: 'none' }}>
                      <LoadingButton variant="contained" sx={{background: theme.palette.error.main}}>
                        {"No Go"}
                      </LoadingButton>
                    </Link>
                    <LoadingButton variant="contained" onClick={() => (setOpenDialogConfGo(true))} sx={{background: theme.palette.success.main}}>
                      {"Go"}
                    </LoadingButton>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
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
                  <Typography variant='h6'>
                    Objet de la Prestation:
                  </Typography>
                  <Grid xs={12} md={10}/>
                  <RHFTextField name="generalite" label="Généralités" multiline value='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in rutrum mauris, nec vestibulum mauris. Quisque ac suscipit lacus, in ornare risus. Ut erat est, blandit nec risus in, auctor vehicula sapien.'/>
                  <RHFTextField name="travail" label="Travail" multiline/>
                  <RHFTextField name="entree" label="Les données d’entrée" multiline/>
                  <RHFTextField name="tech" label="Spécification technique de l’application" multiline/>
                  <RHFTextField name="techOp" label="Spécifications techniques optionnelles" multiline/>
                  <RHFTextField name="sortie" label="Les données de sortie" multiline/>
                  <RHFTextField name="livraison" label="Livraison" multiline value='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in rutrum mauris, nec vestibulum mauris. Quisque ac suscipit lacus, in ornare risus. Ut erat est, blandit nec risus in, auctor vehicula sapien.'/>
                  <Grid xs={12} md={10}/>
                  <Divider />
                  <Divider />
                  <Typography variant='h6'>
                    Proposition de prestation:
                  </Typography>
                  <Grid xs={12} md={10}/>
                  <RHFAutocomplete
                      name="fonctionnement"
                      label={"Fonctionnement"}
                      options={["Cycle en V", "Méthode Agile"]}
                  />
                  <RHFTextField name="detail" label="Détail de la prestation" multiline/>
                  <RHFTextField name="techn" label="Compétences techniques" multiline/>
                  <RHFTextField name="detail" label="Détail de la prestation" multiline/>
                  <RHFTextField name="encadrement" label="Détail de la prestation" multiline value='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in rutrum mauris, nec vestibulum mauris. Quisque ac suscipit lacus, in ornare risus. Ut erat est, blandit nec risus in, auctor vehicula sapien.'/>
                  <RHFTextField name="referentCustomer" label="Interface Client"/>
                  <UploadLayout isEdit={isEdit} handleOpenUploadFile={handleOpenUploadFile} countDoc={count} field={'aor'} title={"Planning"}/>
                  <Grid xs={12} md={10}/>
                  <Divider />
                  <Divider />
                  <Typography variant='h6'>
                    Lieux d'execution de la prestation:
                  </Typography>
                  <Grid xs={12} md={10}/>
                  <RHFTextField name="localisation" label="Localisation"/>
                  <Grid xs={12} md={10}/>
                  <Divider />
                  <Divider />
                  <Typography variant='h6'>
                    Durée de la préstation:
                  </Typography>
                  <Grid xs={12} md={10}/>
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
                  <Grid xs={12} md={10}/>
                  <Divider />
                  <Divider />
                  <Typography variant='h6'>
                    Limites de l'offre:
                  </Typography>
                  <Grid xs={12} md={10}/>
                  <RHFTextField name="limPresta" label="Limites de la prestation" multiline/>
                  <RHFTextField name="changement" label="Changements Majeur / Mineur" multiline/>
                  <Grid xs={12} md={10}/>
                  <Grid xs={12} md={10}/>
                  <Divider />
                  <Divider />
                  <Typography variant='h6'>
                    Montant:
                  </Typography>
                  <Grid xs={12} md={10}/>
                  <RHFTextField
                      name="montant"
                      label="Montant"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box component="span" sx={{ color: 'grey.400' }}>
                              €
                            </Box>
                          </InputAdornment>
                        ),
                        type: 'number',
                      }}
                  />
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
                    <LoadingButton variant="contained" onClick={handleDownloadDocument}>
                      {"Générer la RAO"}
                    </LoadingButton>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <FileNewFolderDialog isCreate={!isEdit} open={openUploadFile} onClose={handleCloseUploadFile} entity='aor' field='Planning' documentsToAdd={{}} documentsToShow={{}} setUploaderInfo={handleSetUploaderInfo}/>
            <FileNewFolderDialog isCreate={!isEdit} open={openUploadFileSup} onClose={handleCloseUploadFileSup} entity='aor' field='Planning' documentsToAdd={{}} documentsToShow={{}} setUploaderInfo={handleSetUploaderInfoSup}/>
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
      <ConfirmDialog
        open={openDialogConfGo}
        onClose={() => (setOpenDialogConfGo(false))}
        title={"Go / No Go"}
        content={
            'Etes-vous sûr de vouloir valider le Go ?'
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleCloseConfirmGo();
            }}
          >
            Go
          </Button>
        }
      />
    </Box>
  );
}
