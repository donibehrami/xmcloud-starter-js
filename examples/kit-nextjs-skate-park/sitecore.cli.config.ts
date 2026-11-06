import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import {
  generateSites,
  generateMetadata,
  extractFiles,
  writeImportMap,
} from '@sitecore-content-sdk/nextjs/tools';
import scConfig from './sitecore.config';
import { ATOMS_CATALOG_METADATA_KEY } from '@sitecore-content-sdk/nextjs/atoms';
import { catalog } from 'src/atoms';

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [
      generateMetadata({
        appInputs: { [ATOMS_CATALOG_METADATA_KEY]: catalog },
      }),
      generateSites(),
      extractFiles(),
      writeImportMap({
        paths: ['src/components'],
      }),
    ],
  },
  componentMap: {
    paths: ['src/components'],
    exclude: [
      'src/components/content-sdk/*',
      'src/components/atoms/**',
      'src/components/ui/**',
      '**/*.props.ts',
      '**/*.props.tsx',
      '**/*.schema.ts',
    ],
  },
});
