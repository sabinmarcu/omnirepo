import { globalLayer } from '@vanilla-extract/css';
import {
  resetLayer as resetLayerName,
  frameworkLayer as frameworkLayerName,
  frameworkSetupLayer as frameworkSetupLayerName,
  themeLayer as themeLayerName,
  themeValuesLayer as themeValuesLayerName,
  themeVariantsLayer as themeVariantsLayerName,
  themeContractLayer as themeContractLayerName,
  componentsLayer as componentsLayerName,
} from './layers.constants.js';

globalLayer(resetLayerName);

export const frameworkLayer = globalLayer(frameworkLayerName);
export const frameworkSetupLayer = globalLayer({ parent: frameworkLayer }, frameworkSetupLayerName);
export const themeLayer = globalLayer({ parent: frameworkLayer }, themeLayerName);
export const themeValuesLayer = globalLayer({ parent: themeLayer }, themeValuesLayerName);
export const themeVariantsLayer = globalLayer({ parent: themeLayer }, themeVariantsLayerName);
export const themeContractLayer = globalLayer({ parent: themeLayer }, themeContractLayerName);
export const componentsLayer = globalLayer({ parent: frameworkLayer }, componentsLayerName);
