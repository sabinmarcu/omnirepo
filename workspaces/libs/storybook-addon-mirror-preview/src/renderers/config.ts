import { WINDOW_PROPERTY } from '../constants.js';

export const configTemplate = (config: any) => `
<script type="module" data-theme-mirror-preview="config">
  window.${WINDOW_PROPERTY} = Object.freeze(${JSON.stringify(config)});
</script>
`.trim();
