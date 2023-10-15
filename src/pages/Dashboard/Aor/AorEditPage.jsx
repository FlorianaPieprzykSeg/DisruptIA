

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import AorNewEditForm from '../../../sections/dashboard/aor/AorNewEditForm';
// user services
import i18next from 'i18next';
import AorATForms from '../../../sections/dashboard/aor/AorATForms';
import AorWPForms from '../../../sections/dashboard/aor/AorWPForms';
// ----------------------------------------------------------------------

export default function AorEditPage() {
  const { themeStretch } = useSettingsContext();
  const [currentAor, setCurrentAor] = useState(null);
  const { name } = useParams();
  
  useEffect(() => {
    setCurrentAor({
      id: 5,
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
    });
  }, [])

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={i18next.t('editAor')}
          links={[
            {
              name: i18next.t('general'),
            },
            {
              name: i18next.t('aorsList'),
              href: PATH_DASHBOARD.aor.list,
            },
            { name: currentAor?.lib },
          ]}
        />

        <AorATForms isEdit currentAor={currentAor} />
      </Container>
    </>
  );
}
