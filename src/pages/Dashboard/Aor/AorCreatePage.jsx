
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import AorNewEditForm from '../../../sections/dashboard/aor/AorNewEditForm';
import i18next from 'i18next';

// ----------------------------------------------------------------------

export default function AorCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={i18next.t('createAor')}
          links={[
            {
              name: i18next.t('general'),
            },
            {
              name: i18next.t('aorsList'),
              href: PATH_DASHBOARD.aor.list,
            },
            { name: i18next.t('createAor') },
          ]}
        />
        <AorNewEditForm />
      </Container>
    </>
  );
}
