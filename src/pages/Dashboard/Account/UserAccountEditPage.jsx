// @mui
import { Container } from '@mui/material';
//authentication
import { useAuthContext } from "../../../auth/useAuthContext"
// components
import { useSettingsContext } from '../../../components/settings';
//general APP

// assets
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import AccountEditForm from '../../../sections/dashboard/account/AccountEditForm';
import { userService } from '../../../_services/user.service';
import { useEffect, useState } from 'react';
import i18next from 'i18next';


// ----------------------------------------------------------------------


export default function UserAccountEditPage() {

  const { themeStretch } = useSettingsContext();

  const { user } = useAuthContext();
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {     
    /*userService.getUser(user.id)
      .then(res => {
          setCurrentUser(res.data)
      })
    .catch(err => console.log(err))
    */
    setCurrentUser({
      id: 1,
      cat: 'admin',
      fullName: 'Segula Team',
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
          heading={i18next.t('editUserAccount')}
          links={[
            { name: user.fullName},
          ]}
        />
        <AccountEditForm currentUser={currentUser}/>
      </Container>
    </>
  );
}