import {
  AppBar,
  Toolbar,
  styled,
} from '@mui/material';

export const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  paddingBlock: '1rem',
  background: theme.palette.background.paper,
  '&, & svg': {
    color: theme.palette.text.primary,
  },
}));
export const HeaderToolbar = styled(Toolbar)({
  gap: '1rem',
});
