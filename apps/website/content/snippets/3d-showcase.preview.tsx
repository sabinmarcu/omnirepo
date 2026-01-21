import { assignInlineVars } from '@vanilla-extract/dynamic';
import { ShowcaseList } from './3d-showcase.list';
import { defaults } from './3d-showcase.css';

export default function ShowcasePreview() {
  return (
    <main style={assignInlineVars(defaults)}>
      <ShowcaseList />
    </main>
  );
}
