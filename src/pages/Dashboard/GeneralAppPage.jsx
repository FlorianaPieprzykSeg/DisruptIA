// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Button, Card, Typography, Divider } from '@mui/material';
//authentication
import { useAuthContext } from "../../auth/useAuthContext"
// components
import { useSettingsContext } from '../../components/settings';
import { SeoIllustration } from '../../assets/illustrations';
import { Link } from 'react-router-dom';
import i18next from 'i18next';
//general APP
import {AppWelcome} from '../../sections/general/app';
import { AnalyticsCount } from '../../sections/general/analytics';
import RaoSimiListPage from '../../components/segula-components/raoPrevious/RaoSimiListPage';
import RaoListPage from '../../components/segula-components/rao/RaoListPage';


// ----------------------------------------------------------------------


export default function GeneralAppPage() {

    const { user } = useAuthContext()

    const theme = useTheme();

    const { themeStretch } = useSettingsContext();

    
    return(
    <Container maxWidth={themeStretch ? false : 'xl'}>
    <Grid container spacing={1}>
      <Grid item xs={12} md={3}>
        <Card sx={{ mb: 5, py: 2, mr: 2, minWidth:'20%' }}>
            <AnalyticsCount
              title="Total"
              total={120}
              percent={52}
              unity={"RAOs en cours"}
              icon="ic:round-people-alt"
              color={theme.palette.kpi[0]} 
            />
        </Card>
      </Grid>
      <Grid item xs={12} md={12} sx={{mb: 5}}>
        <Typography textAlign={'center'} variant='h6' sx={{mb:2}}>
          RAOs me concernant :
        </Typography>
        <RaoListPage/>
      </Grid>
      <Grid item xs={12} md={12}>
        <Divider/>
        <Typography textAlign={'center'} variant='h6' sx={{mt:2, mb:2}}>
          RAOs Gagnés dans l'année :
        </Typography>
        <RaoSimiListPage onlyWon={true}/>
      </Grid>


      </Grid>
    </Container>
)}