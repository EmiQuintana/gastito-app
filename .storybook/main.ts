import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-native-web-vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/ui/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-native-web-vite',
  async viteFinal(viteConfig) {
    viteConfig.resolve ??= {};
    const existingAlias = viteConfig.resolve.alias;
    const aliasList = Array.isArray(existingAlias)
      ? existingAlias
      : existingAlias
        ? Object.entries(existingAlias).map(([find, replacement]) => ({
            find,
            replacement: String(replacement),
          }))
        : [];

    viteConfig.resolve.alias = [
      ...aliasList,
      { find: '@', replacement: path.resolve(dirname, '../src') },
    ];

    return viteConfig;
  },
};

export default config;
