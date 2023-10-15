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

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit = false, currentUser }) {
  const categories = ['admin','dirGeneral','dirBranch','dirDivision','rbu'];
  const [ usernameApiError, setUsernameApiError ] = useState(null);
  const [ passwordRepeatApiError, setPasswordRepeatApiError ] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();



  const NewUserSchema = (isEdit)
    ? Yup.object().shape({    
      username: Yup.string().required(i18next.t('usernameError')),
      email: Yup.string().email(i18next.t('emailFormatError')).required(i18next.t('emailMissingError')),
      firstName: Yup.string().required(i18next.t('firstNameError')),
      lastName: Yup.string().required(i18next.t('lastNameError')),
      cat: Yup.string().required(i18next.t('catError')),
    })
    : Yup.object().shape({    
        username: Yup.string().required(i18next.t('usernameError')),
        email: Yup.string().email(i18next.t('emailFormatError')).required(i18next.t('emailMissingError')),
        firstName: Yup.string().required(i18next.t('firstNameError')),
        lastName: Yup.string().required(i18next.t('lastNameError')),
        cat: Yup.string().required(i18next.t('catError')),
        password: Yup.string().required(i18next.t('passwordError')),
        passwordRepeat: Yup.string().required(i18next.t('passwordAgainError')),
      });

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      cat: currentUser?.cat || '',
      password: currentUser?.password || '',
      passwordRepeat: currentUser?.passwordRepeat || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    setUsernameApiError(null);
    setPasswordRepeatApiError(null);
    navigate(PATH_DASHBOARD.user.list)
    enqueueSnackbar('Nouvel Utilisateur ajouté avec succès!');
    /*try {
      if (isEdit && currentUser) {
        //updata method needs user id
        data.id = currentUser.id;
        userService.updateUser(data)
          .then(res => {
            navigate(PATH_DASHBOARD.user.list)
            enqueueSnackbar('User updated successfully');
          })
          .catch(err => {
            console.log(err.response.data.errors[0].key);
            if(err.response.data.errors[0].key == "username") {
              setUsernameApiError(i18next.t(err.response.data.errors[0].code));
            }
          });
      }
      if (!isEdit) {
        userService.addUser(data)
          .then(res => {
            navigate(PATH_DASHBOARD.user.list)
            enqueueSnackbar('User added successfully');
          })
          .catch(err => {
            console.log(err.response.data.errors[0].key);
            if(err.response.data.errors[0].key == "username") {
              setUsernameApiError(i18next.t(err.response.data.errors[0].code));
            } else if(err.response.data.errors[0].key == "passwordRepeat") {
              setPasswordRepeatApiError(i18next.t(err.response.data.errors[0].code));
            }
          })

      }
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }*/
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
              <RHFAutocomplete
                name="cat"
                label={i18next.t('cat')}
                options={categories}
                getOptionLabel={(option) => i18next.t(option)}
              />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>
              <RHFTextField name="firstName" label={i18next.t('firstName')} />
              <RHFTextField name="lastName" label={i18next.t('lastName')} />
              <RHFTextField name="email" label={i18next.t('email')} />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>
              <RHFTextField 
                name="username" 
                label={i18next.t('username')} 
                helperText={usernameApiError} 
                errorBack={usernameApiError || null}
              />
              <Grid item xs={12} sm={6}>
                {/* Add the placeholder div */}
                <div></div>
              </Grid>

              {!isEdit && (
                <RHFTextField 
                  name="password" 
                  label={i18next.t('password')}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                    ),
                  }}
                />
              )}
              {!isEdit && (
                <RHFTextField 
                  name="passwordRepeat" 
                  label={i18next.t('passwordAgain')}
                  helperText={passwordRepeatApiError} 
                  errorBack={passwordRepeatApiError || null} 
                  type={showPasswordRepeat ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPasswordRepeat(!showPasswordRepeat)} edge="end">
                        <Iconify icon={showPasswordRepeat ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                    ),
                  }}
                />
              )}
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
                <Link to='/dashboard/user/list' style={{ textDecoration: 'none' }}><Button variant="contained">{i18next.t('cancel')}</Button></Link>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? i18next.t('create') : i18next.t('editConfirm')}
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
