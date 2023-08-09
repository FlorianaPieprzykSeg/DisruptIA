// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Button } from '@mui/material';
//authentication
import { useAuthContext } from "../../auth/useAuthContext"
// components
import { useSettingsContext } from '../../components/settings';
import { SeoIllustration } from '../../assets/illustrations';
import { Link } from 'react-router-dom';
import i18next from 'i18next';
//general APP
import {AppWelcome} from '../../sections/general/app';


// ----------------------------------------------------------------------


export default function GeneralAppPage() {

    const { user } = useAuthContext()

    const theme = useTheme();

    const { themeStretch } = useSettingsContext();

    
    return(
    <Container maxWidth={themeStretch ? false : 'xl'}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <AppWelcome
          title={`${i18next.t('welcomeBack')} \n ${user?.firstName + ' ' + user.lastName} !`}
          description={i18next.t('welcomeBackText')}
          img={
            <SeoIllustration
              sx={{
                p: 3,
                width: 360,
                margin: { xs: 'auto', md: 'inherit' },
              }}
            />
          }
          action={<Link to='/dashboard/user/list' style={{ textDecoration: 'none' }}><Button variant="contained">{i18next.t('start')}</Button></Link>}
        />
      </Grid>

      </Grid>
    </Container>
)}