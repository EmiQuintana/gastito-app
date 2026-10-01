import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';

import { Text } from '../Text/Text';
import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Text>Contenedor de superficie para agrupar contenido.</Text>,
  },
};

export const ExpensePreview: Story = {
  render: () => (
    <Card>
      <View style={{ gap: 4 }}>
        <Text variant="label" tone="muted">
          Súper
        </Text>
        <Text variant="title">$ 5.000</Text>
        <Text variant="caption" tone="muted">
          Hoy · lenguaje natural
        </Text>
      </View>
    </Card>
  ),
};
