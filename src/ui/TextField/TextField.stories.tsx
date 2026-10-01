import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';

import { TextField } from './TextField';

const meta = {
  title: 'UI/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Monto',
    placeholder: '0',
    onChangeText: fn(),
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: '5000' },
};

export const Numeric: Story = {
  args: {
    keyboardType: 'numeric',
    placeholder: 'Ej. 5000',
  },
};

export const Error: Story = {
  args: {
    value: '',
    error: 'Ingresá un monto mayor a 0',
  },
};

export const Disabled: Story = {
  args: {
    value: '1200',
    editable: false,
  },
};
