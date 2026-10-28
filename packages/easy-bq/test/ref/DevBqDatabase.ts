import { create, DefaultProvider } from '@thisisagile/easy/Database';

export const DevBqDatabase = {
  DevBQ: create('DevBQ', DefaultProvider, { projectId: 'test-project' }),
};
