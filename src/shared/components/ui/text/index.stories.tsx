import { Meta, StoryObj } from '@storybook/react'

import { Text } from '.'

export default {
  title: 'UI/Text',
  component: Text,
  argTypes: {
    typo: {
      control: 'select',
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'subtitle1-bold',
        'subtitle2-bold',
        'subtitle2-medium',
        'body1-bold',
        'body1-medium',
        'body1-regular',
        'body2-bold',
        'body2-medium',
        'caption-bold',
        'caption-medium',
        'button1',
        'button2',
        'button3',
        'button4',
        'button5',
        'question',
      ],
    },
    color: {
      control: 'select',
      options: [
        'white',
        'gray-50',
        'gray-100',
        'gray-200',
        'gray-300',
        'gray-400',
        'gray-500',
        'gray-600',
        'gray-700',
        'gray-800',
        'gray-900',
        'black',
        'blue-50',
        'blue-100',
        'blue-200',
        'blue-300',
        'blue-400',
        'blue-500',
        'blue-600',
        'blue-700',
        'blue-800',
        'blue-900',
        'orange-50',
        'orange-100',
        'orange-200',
        'orange-300',
        'orange-400',
        'orange-500',
        'orange-600',
        'orange-700',
        'text-01',
        'text-02',
        'text-03',
        'primary',
        'secondary',
        'sub',
        'caption',
        'success',
        'error',
      ],
    },
    as: {
      control: 'text',
    },
  },
} as Meta<typeof Text>

export const Playground: StoryObj<typeof Text> = {
  args: {
    typo: 'h1',
    color: 'primary',
    as: 'div',
    children: 'Hello, Storybook! Customize me as you wish.',
  },
}
