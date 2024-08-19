import {
  Card,
  styled,
} from '@mui/material';

export type RotationCardProperties = {
  isActive?: boolean;
};
export const RotationCard = styled(Card)<RotationCardProperties>(
  ({
    theme,
  }) => ({
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    overflow: 'visible',
    [theme.breakpoints.down('lg')]: {
      flexFlow: 'column nowrap',
    },
    position: 'relative',
  }),
  ({
    isActive,
    theme,
  }) => {
    if (isActive) {
      return {};
    }
    return {
      opacity: 0.4,
      transition: theme.transitions.create('opacity'),
      '&:hover': {
        opacity: 1,
      },
    };
  },
);
