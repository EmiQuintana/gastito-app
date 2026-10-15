import type { Preview } from '@storybook/react-native-web-vite';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../src/ui/theme';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'gastito',
      values: [{ name: 'gastito', value: colors.paper }],
    },
  },
  decorators: [
    (Story) => (
      <View style={styles.canvas}>
        <Story />
      </View>
    ),
  ],
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.paper,
  },
});

export default preview;
