import { useAtom } from 'jotai';
import type { MouseEvent } from 'react';
import {
  useMemo,
  useState,
} from 'react';
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import type { Selections } from '../state/theme';
import { themeSelectionAtom } from '../state/theme';
import { selections } from '../constants/theme';
import { ThemeSelectorWrapper } from './ThemeSelector.style';

const getSelectionData = (input: Selections): (typeof selections)[number] => (
  selections.find(({ value }) => value === input)!
);

export const ThemeSelector = () => {
  const [selection, setSelection] = useAtom(themeSelectionAtom);
  const { name: currentName, icon: CurrentIcon } = useMemo(
    () => getSelectionData(selection),
    [selection],
  );

  const [anchorElement, setAnchorElement] = useState<HTMLElement | undefined>(undefined);
  const handleOpen = (event: MouseEvent<HTMLElement>) => setAnchorElement(event.currentTarget);
  const handleClose = () => setAnchorElement(undefined);
  const open = !!anchorElement;

  const handleSelection = (nextSelection: Selections) => () => {
    setSelection(nextSelection);
    handleClose();
  };
  return (
    <>
      <ThemeSelectorWrapper>
        <Tooltip title={currentName}>
          <IconButton
            id="theme-selection-button"
            type="button"
            color="primary"
            aria-controls={open ? 'theme-selection-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleOpen}
          >
            <CurrentIcon />
          </IconButton>
        </Tooltip>
      </ThemeSelectorWrapper>
      <Menu
        id="theme-selection-menu"
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'theme-selection-button' }}
      >
        {selections.map(({ value, icon: Icon, name }) => (

          <MenuItem key={value} onClick={handleSelection(value)}>
            <ListItemIcon><Icon /></ListItemIcon>
            <Typography variant="body2">{name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
