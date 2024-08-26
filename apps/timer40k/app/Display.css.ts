import {
  globalStyle,
  keyframes,
  style,
} from '@vanilla-extract/css';

globalStyle('html, body, #root', {
  inlineSize: '100vw',
  blockSize: '100vh',
  marginBlockStart: '0',
  marginBlockEnd: '0',
  marginInlineStart: '0',
  marginInlineEnd: '0',
  overflow: 'hidden',
  position: 'relative',
  background: 'black',
});

const blink = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: '0.5' },
  '100%': {
    opacity: 1,
  },
});

const backgroundSharedStyleRaw = {
  position: 'absolute',
  inlineSize: '100%',
  blockSize: '100%',
} as const;

const backgroundSharedStyle = style(backgroundSharedStyleRaw);

const backgroundStyle = style([
  backgroundSharedStyle,
  {
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    selectors: {
      '&::after': backgroundSharedStyleRaw,
    },
  },
]);

const backgroundImageStyle = style([
  backgroundSharedStyle,
  {
    objectFit: 'cover',
    filter: 'blur(20px)',
    animation: `${blink} infinite ease-in-out 5s`,
  },
]);

const foregroundStyle = style({
  position: 'relative',
  inlineSize: '100%',
  blockSize: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexFlow: 'column nowrap',
});

const releaseTextStyle = style({
  paddingBlockStart: '1.5rem',
  textTransform: 'uppercase',
  fontSize: '2rem',
  textShadow: '0 1px 5px black',
  color: 'white',
});

const earlyReleaseTextStyle = style([
  releaseTextStyle,
  {
    opacity: 0.6,
  },
]);

const foregroundImageStyle = style({
  boxShadow: '0px 0px 12px 0px black',
  inlineSize: 'auto',
  blockSize: 'auto',
  maxInlineSize: '75cqw',
  minBlockSize: '50cqh',
  maxBlockSize: '60cqh',
});

export default {
  background: backgroundStyle,
  backgroundImage: backgroundImageStyle,
  foreground: foregroundStyle,
  releaseText: releaseTextStyle,
  earlyReleaseText: earlyReleaseTextStyle,
  foregroundImage: foregroundImageStyle,
};
