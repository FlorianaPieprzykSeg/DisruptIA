

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
import DatabaseNewEditForm from '../../../sections/dashboard/database/DatabaseNewEditForm';
// database services
import i18next from 'i18next';
// ----------------------------------------------------------------------

export default function DatabaseEditPage() {
  const { themeStretch } = useSettingsContext();
  const [currentProject, setCurrentProject] = useState(null);
  const { name } = useParams();
  
  useEffect(() => {     
    /*databaseService.getDatabase(name)
        .then(res => {
            setCurrentProject(res.data)
        })
        .catch(err => console.log(err))
    */
    setCurrentProject({
      id: 1,
      lib: 'Managements des tests de roulage',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.',
      customer: 'Stellantis',
      sector: 'Automobile',
      cat: 'Developpement',
      result: 'Perdu',
      referent: 'Pierre Guizard',
      createdAt: '2022-08-23T16:50:22-07:00',
      updatedAt: '2022-08-23T16:50:22-07:00'
    });
  }, [])

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={currentProject?.lib}
          links={[
            {
              name: i18next.t('general'),
            },
            {
              name: "Liste des RAOs précédants",
              href: PATH_DASHBOARD.database.list,
            },
            { name: currentProject?.lib },
          ]}
        />

        <DatabaseNewEditForm isEdit currentProject={currentProject} />
      </Container>
    </>
  );
}
