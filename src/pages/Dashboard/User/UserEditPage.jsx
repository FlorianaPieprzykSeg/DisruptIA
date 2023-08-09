

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
import UserNewEditForm from '../../../sections/dashboard/user/UserNewEditForm';
// user services
import i18next from 'i18next';
// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { themeStretch } = useSettingsContext();
  const [currentUser, setCurrentUser] = useState(null);
  const { name } = useParams();
  
  useEffect(() => {     
    /*userService.getUser(name)
        .then(res => {
            setCurrentUser(res.data)
        })
        .catch(err => console.log(err))
    */
    setCurrentUser({
      id: 1,
      cat: 'admin',
      firstName: 'Segula',
      lastName: 'Team',
      username: 'Segula_Team',
      password: 'Segula_Team',
      email: 'Segula_Team@Segula.team',
      createdAt: '2022-08-23T16:50:22-07:00',
      updatedAt: '2022-08-23T16:50:22-07:00'
    });
  }, [])

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={i18next.t('editUser')}
          links={[
            {
              name: i18next.t('settings'),
            },
            {
              name: i18next.t('usersList'),
              href: PATH_DASHBOARD.user.list,
            },
            { name: currentUser?.username },
          ]}
        />

        <UserNewEditForm isEdit currentUser={currentUser} />
      </Container>
    </>
  );
}
