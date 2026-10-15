import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import { Text } from './Text';

const meta = {
  title: 'UI/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    children: 'Gastito',
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Amount: Story = {
  args: { variant: 'amount', children: '$193.700' },
};

export const Title: Story = {
  args: { variant: 'title', children: 'Nuevo gasto' },
};

export const Section: Story = {
  args: { variant: 'section', children: 'Movimientos' },
};

export const Body: Story = {
  args: { variant: 'body', children: 'Cargá un gasto y lo ves agrupado por categoría.' },
};

export const Caption: Story = {
  args: { variant: 'caption', tone: 'muted', children: 'Comida · 14 oct' },
};

export const Label: Story = {
  args: { variant: 'label', tone: 'muted', children: 'Monto' },
};
