import type { Preview } from '@storybook/react';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    backgrounds: {
      default: 'workspace-light',
      values: [
        { name: 'workspace-light', value: '#f1f5f9' },
        { name: 'workspace-dark', value: '#0f172a' }
      ]
    },
    layout: 'fullscreen',
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Explorer', 'Workspace', 'Admin', ['default', 'states', 'interactions']]
      }
    }
  }
};

export default preview;
