import { styled } from '@mui/material';
import { Background as MeshBackground } from '@sabinmarcu/moving-mesh-background';

export const AppWrapper = styled('main')({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflowY: 'auto',
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
});

export const BackgroundWrapper = styled('div')(({ theme }) => ({
  '&&': {
    position: 'absolute',
  },
  inset: '5px',
  opacity: theme.palette.mode === 'light' ? 0.4 : 0.2,
}));

export const StyledBackground = styled(MeshBackground)(({ theme }) => ({
  width: '100%',
  height: '100%',
  opacity: 0.3,
  '--render-color': theme.palette.primary.main,
}));

