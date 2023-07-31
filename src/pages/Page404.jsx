import { m } from 'framer-motion';

import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { PageNotFoundIllustration } from '../assets/illustrations';
import { PATH_DASHBOARD } from '../routes/paths';
import i18next from 'i18next';

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <header>
        <title> 404 Page Not Found</title>
      </header>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            {i18next.t('notFound')}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            {i18next.t('notFoundText')}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        <Button component={RouterLink} to={PATH_DASHBOARD.general.app} size="large" variant="contained">
          {i18next.t('goToHome')}
        </Button>
      </MotionContainer>
    </>
  );
}
