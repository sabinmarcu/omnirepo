import {
  styled,
  Typography,
} from '@mui/material';
import { Background as MeshBackground } from '@sabinmarcu/moving-mesh-background';
import { Section } from './Section';

export const HeadingSection = styled(Section)(({ theme }) => {
  const color = theme.palette.mode === 'light' ? '0' : '255';
  return ({
    background: `linear-gradient(0, rgba(${color}, ${color}, ${color}, 0.1), transparent 25%)`,
    paddingBlock: '6cqh 4cqh',
    position: 'relative',
  });
});

export const BackgroundWrapper = styled('div')({
  position: 'absolute',
  inset: 0,
});

export const Background = styled(MeshBackground)(({ theme }) => ({
  width: '100%',
  height: '100%',
  opacity: 0.3,
  '--render-color': theme.palette.primary.main,
}));

export const Heading = styled(Typography)(() => ({
  fontSize: '4rem',
  lineHeight: '5rem',
  textAlign: 'center',
  filter: 'blur(1px)',
  textShadow: '0 0 20rem black',
}));
