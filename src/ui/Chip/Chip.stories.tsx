import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { View } from 'react-native';

import { categoryColor } from '../theme';
import { Chip } from './Chip';

const meta = {
  title: 'UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: {
    label: 'Comida',
    onPress: fn(),
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true, color: categoryColor('Comida') },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Categories: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Chip label="Comida" color={categoryColor('Comida')} selected onPress={fn()} />
      <Chip label="Transporte" color={categoryColor('Transporte')} onPress={fn()} />
      <Chip label="Hogar" color={categoryColor('Hogar')} onPress={fn()} />
      <Chip label="Ocio" color={categoryColor('Ocio')} onPress={fn()} />
      <Chip label="Otros" color={categoryColor('Otros')} onPress={fn()} />
    </View>
  ),
};
