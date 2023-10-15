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

// ----------------------------------------------------------------------

DatabaseNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProject: PropTypes.object,
};

export default function DatabaseNewEditForm({ isEdit = false, currentProject }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewDatabaseSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      lib: currentProject?.lib || '',
      description: currentProject?.description || '',
      customer: currentProject?.customer || '',
      sector: currentProject?.sector || '',
      cat: currentProject?.cat || '',
      result: currentProject?.result || '',
      referent: currentProject?.referent || '',
    }),
    [currentProject]
  );

  const methods = useForm({
    resolver: yupResolver(NewDatabaseSchema),
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
  }, [isEdit, currentProject]);

  return (
    <FormProvider methods={methods}>
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
              <RHFTextField name="lib" label="Libellé" disabled/>
              <RHFTextField name="customer" label="Client" disabled/>
              <RHFTextField name="sector" label="Sector" disabled/>
              <RHFTextField name="cat" label="Catégorie" disabled/>
              <RHFTextField name="result" label="Resultat" disabled/>
              <RHFTextField name="referent" label="Referent" disabled/>
              <RHFTextField name="description" label="Description" multiline disabled/>
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
                <Link to='/dashboard/database/list' style={{ textDecoration: 'none' }}><Button variant="contained">{'Retour'}</Button></Link>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
