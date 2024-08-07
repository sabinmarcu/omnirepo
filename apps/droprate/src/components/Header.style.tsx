import {
  styled,
  Typography,
} from '@mui/material';
import { Background as MeshBackground } from '@sabinmarcu/moving-mesh-background';
import { Section } from './Section.js';

export const HeadingSection = styled(Section)(({ theme }) => {
  const color = theme.palette.mode === 'light' ? 'black' : 'white';
  return ({
    background: `linear-gradient(0, hsla(from ${color} h s l / 0.1), transparent 25%)`,
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

export const Heading = styled(Typography)(({ theme }) => {
  const color = theme.palette.mode === 'light' ? 'white' : 'black';
  return {
    fontSize: '4rem',
    lineHeight: '5rem',
    textAlign: 'center',
    color: `hsla(from ${theme.palette.text.primary} h s l / 0.6)`,
    textShadow: `0 0 20rem hsla(from ${color} h s l / 0.3)`,
  };
});
