import type { Meta, StoryObj } from '@storybook/react'

import Sidebar from '../components/Sidebar'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>

export default meta

export const Primary: StoryObj<typeof meta> = {}
