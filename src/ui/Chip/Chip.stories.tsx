import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { View } from 'react-native';

import { Chip } from './Chip';

const meta = {
  title: 'UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: {
    label: 'Súper',
    onPress: fn(),
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Categories: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Chip label="Súper" selected onPress={fn()} />
      <Chip label="Transporte" onPress={fn()} />
      <Chip label="Comida" onPress={fn()} />
      <Chip label="Ocio" onPress={fn()} />
    </View>
  ),
};
