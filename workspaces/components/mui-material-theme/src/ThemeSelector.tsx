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
import type { Selections } from './types.js';
import { selections } from './themes.js';
import { useThemeSelection } from './state.js';

const getSelectionData = (input: Selections): (typeof selections)[number] => (
  selections.find(({ value }) => value === input)!
);

export function ThemeSelector() {
  const [selection, setSelection] = useThemeSelection();

  const {
    name: currentName, icon: CurrentIcon,
  } = useMemo(
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
      <Menu
        id="theme-selection-menu"
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'theme-selection-button' }}
      >
        {selections.map(({
          value, icon: Icon, name,
        }) => (

          <MenuItem key={value} onClick={handleSelection(value)}>
            <ListItemIcon><Icon /></ListItemIcon>
            <Typography variant="body2">{name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

