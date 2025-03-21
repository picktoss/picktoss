import { Meta, StoryObj } from '@storybook/react'

import { Question } from '.'

const meta: Meta<typeof Question> = {
  title: 'Quiz/Question',
  component: Question,
  parameters: {
    layout: 'centered',
    docs: {
      page: null,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Question>

export const WithQuizNumber: Story = {
  render: () => <Question quizNumber={1} content="이것은 퀴즈 질문입니다. 어떤 답변이 맞을까요?" />,
}

export const WithOriginName: Story = {
  render: () => <Question originName="토스" content="이것은 퀴즈 질문입니다. 어떤 답변이 맞을까요?" />,
}
