import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import i18next from 'i18next';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();

  return (
    <Link component={RouterLink} to={PATH_DASHBOARD.user.account} underline="none" color="inherit">
      <StyledRoot>
        {user?.cat == 'admin' &&
          <CustomAvatar src="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_11.jpg" alt={user?.firstName + ' ' + user.lastName} name={user?.firstName + ' ' + user.lastName} />
        }
        {user?.cat == 'dirGeneral' &&
          <CustomAvatar src="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_18.jpg" alt={user?.firstName + ' ' + user.lastName} name={user?.firstName + ' ' + user.lastName} />
        }
        {user?.cat == 'dirBranch' &&
          <CustomAvatar src="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_23.jpg" alt={user?.firstName + ' ' + user.lastName} name={user?.firstName + ' ' + user.lastName} />
        }
        {user?.cat == 'dirDivision' &&
          <CustomAvatar src="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_24.jpg" alt={user?.firstName + ' ' + user.lastName} name={user?.firstName + ' ' + user.lastName} />
        }
        {user?.cat == 'rbu' &&
          <CustomAvatar src="https://api-dev-minimal-v4.vercel.app/assets/images/avatars/avatar_2.jpg" alt={user?.firstName + ' ' + user.lastName} name={user?.firstName + ' ' + user.lastName} />
        }

        <Box sx={{ ml:2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap >
            {user?.firstName + ' ' + user.lastName}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.secondary', textAlign:'left' }}>
            {i18next.t(user?.cat)}
          </Typography>
        </Box>
      </StyledRoot>
    </Link>
  );
}
