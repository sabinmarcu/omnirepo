import { globalStyle } from '@vanilla-extract/css';

export const defaultGridSelector = 'data-grid';
export function createGrids<
  const Grids extends string[],
  const GridsSelector extends string = typeof defaultGridSelector,
>(
  grids: Grids,
  selector: GridsSelector = defaultGridSelector as any,
) {
  const gridsMap = Object.fromEntries(
    grids.map((it) => [it, it]),
  ) as { [Key in Grids[number]]: Key };

  const selectorObject = <Grid extends Grids[number]>(grid: Grid) => ({
    [selector]: grid,
  } as unknown as { [Key in GridsSelector]: Grid });

  const rawSelector = <
    const Grid extends Grids[number],
  >(grid: Grid) => (
      `[${selector}=${grid}]`
    ) as `[${GridsSelector}=${Grid}]`;

  const gridSelector = <
    const Grid extends Grids[number],
    const Prefix extends string | undefined = undefined,
  >(
      grid: Grid,
      prefix?: Prefix,
    ) => {
    let result = rawSelector(grid);
    if (prefix) {
      result = `${prefix} ${result}` as any;
    }
    return result as (
      Prefix extends string
        ? `${Prefix} [${GridsSelector}=${Grid}]`
        : `[${GridsSelector}=${Grid}]`
    );
  };

  const renderGridSelectors = <Prefix extends string>(prefix: Prefix) => {
    for (const grid of grids) {
      globalStyle(gridSelector(grid, prefix), {
        gridArea: grid,
      });
    }
  };

  const gridsRender = (
    mapper: (grids: typeof gridsMap) => Grids[number][][],
  ): string => {
    const mapping = mapper(gridsMap);
    const rendered = mapping.map((row) => (
      `"${row.join(' ')}"`
    )).join('\n');
    return rendered;
  };

  return {
    mapping: gridsMap,
    mapper: gridsRender,
    selector: selectorObject,
    renderer: renderGridSelectors,
    extend: gridSelector,
    rawSelector,
  };
}
