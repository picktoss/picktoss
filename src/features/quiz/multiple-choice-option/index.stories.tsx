import { Meta, StoryObj } from '@storybook/react'

import { MultipleChoiceOption } from '.'

const meta: Meta<typeof MultipleChoiceOption> = {
  title: 'Quiz/MultipleChoiceOption',
  component: MultipleChoiceOption,
  parameters: {
    layout: 'centered',
    docs: {
      page: null,
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 w-[400px]">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof MultipleChoiceOption>

export const Default: Story = {
  args: {
    index: 0,
    content: '정답 내용 입력',
    state: 'default',
  },
}

export const Correct: Story = {
  args: {
    index: 0,
    content: '정답 내용 입력',
    state: 'correct',
  },
}

export const Incorrect: Story = {
  args: {
    index: 0,
    content: '정답 내용 입력',
    state: 'incorrect',
  },
}

export const DifferentIndex: Story = {
  args: {
    index: 1,
    content: 'B로 표시되는 옵션',
    state: 'default',
  },
}

export const AllOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <MultipleChoiceOption index={0} content="첫 번째 옵션" state="default" />
      <MultipleChoiceOption index={1} content="두 번째 옵션" state="correct" />
      <MultipleChoiceOption index={2} content="세 번째 옵션" state="incorrect" />
      <MultipleChoiceOption index={3} content="disabled" state="disabled" selectable={false} />
    </div>
  ),
}
