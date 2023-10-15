
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import DatabaseNewEditForm from '../../../sections/dashboard/database/DatabaseNewEditForm';
import i18next from 'i18next';

// ----------------------------------------------------------------------

export default function DatabaseCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={i18next.t('createDatabase')}
          links={[
            {
              name: i18next.t('general'),
            },
            {
              name: i18next.t('databasesList'),
              href: PATH_DASHBOARD.database.list,
            },
            { name: i18next.t('createDatabase') },
          ]}
        />
        <DatabaseNewEditForm />
      </Container>
    </>
  );
}
