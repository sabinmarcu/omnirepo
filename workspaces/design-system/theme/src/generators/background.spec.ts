import {
  describe,
  expect,
  it,
} from 'vitest';
import { getColor } from '../utils/color.js';
import { backgroundGenerator } from './background.js';

describe('backgroundGenerator', () => {
  it('moves elevated surfaces toward text contrast in light themes', () => {
    const background = backgroundGenerator('oklch(80% 0.02 68)');

    expect(background.elevated).toContain(`${getColor('#000f')} 20%`);
    expect(background.depressed).toContain(`${getColor('#ffff')} 20%`);
    expect(background.text).toBe(getColor('#000f'));
  });

  it('moves elevated surfaces toward text contrast in dark themes', () => {
    const background = backgroundGenerator('oklch(20% 0.02 68)');

    expect(background.elevated).toContain(`${getColor('#ffff')} 40%`);
    expect(background.depressed).toContain(`${getColor('#000f')} 20%`);
    expect(background.text).toBe(getColor('#ffff'));
  });
});
