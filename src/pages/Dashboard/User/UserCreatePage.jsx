
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import UserNewEditForm from '../../../sections/dashboard/user/UserNewEditForm';
import i18next from 'i18next';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={i18next.t('createUser')}
          links={[
            {
              name: i18next.t('settings'),
            },
            {
              name: i18next.t('usersList'),
              href: PATH_DASHBOARD.user.list,
            },
            { name: i18next.t('createUser') },
          ]}
        />
        <UserNewEditForm />
      </Container>
    </>
  );
}
