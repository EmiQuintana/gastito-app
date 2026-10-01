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

export const Display: Story = {
  args: { variant: 'display', children: 'Tus gastos, claros' },
};

export const Title: Story = {
  args: { variant: 'title', children: 'Octubre 2026' },
};

export const Body: Story = {
  args: { variant: 'body', children: 'Cargá un gasto y lo ves agrupado por categoría.' },
};

export const Caption: Story = {
  args: { variant: 'caption', tone: 'muted', children: 'Los montos están en ARS' },
};

export const Label: Story = {
  args: { variant: 'label', children: 'Monto' },
};

export const Danger: Story = {
  args: { tone: 'danger', children: 'El monto es obligatorio' },
};
