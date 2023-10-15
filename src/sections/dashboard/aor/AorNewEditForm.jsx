import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, InputAdornment, IconButton, Button } from '@mui/material';
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
import { UploadLayout } from '../../../components/segula-components';
import { FileNewFolderDialog } from '../file';

// ----------------------------------------------------------------------

AorNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentAor: PropTypes.object,
};

export default function AorNewEditForm({ isEdit = false, currentAor }) {
  const categories = ['admin','dirGeneral','dirBranch','dirDivision','rbu'];
  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [openUploadFileSup, setOpenUploadFileSup] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [count, setCount] = useState(0);
  const [countSup, setCountSup] = useState(0);

  //Handle procedure upload Dialog
  const handleOpenUploadFile = () => {
    setOpenUploadFile(true);
  };

  const handleCloseUploadFile = () => {
    setOpenUploadFile(false);
  }
  const handleSetUploaderInfo = (data, callback) => {
    setCount(count+1);
    enqueueSnackbar('Document Added');
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
    enqueueSnackbar('Document Added');
    handleCloseUploadFileSup();
  }

  const NewAorSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({}),
    [currentAor]
  );

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
  }, [isEdit, currentAor]);

  const onSubmit = async (data) => {
    navigate(PATH_DASHBOARD.aor.list)
    enqueueSnackbar('Nouveau RAO ajouté avec succès!');
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>

        <Grid item xs={12} md={8}>
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
              <UploadLayout isEdit={isEdit} handleOpenUploadFile={handleOpenUploadFile} countDoc={count} field={'aor'} title={"RAO"}/>
              <UploadLayout isEdit={isEdit} handleOpenUploadFile={handleOpenUploadFile} countDoc={count} field={'aor'} title={"Documents Additionnels"}/>
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
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? i18next.t('create') : i18next.t('editConfirm')}
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <FileNewFolderDialog isCreate={!isEdit} open={openUploadFile} onClose={handleCloseUploadFile} entity='aor' field='aor' documentsToAdd={{}} documentsToShow={{}} setUploaderInfo={handleSetUploaderInfo}/>
        <FileNewFolderDialog isCreate={!isEdit} open={openUploadFileSup} onClose={handleCloseUploadFileSup} entity='aor' field='aor' documentsToAdd={{}} documentsToShow={{}} setUploaderInfo={handleSetUploaderInfoSup}/>
      </Grid>
    </FormProvider>
  );
}
