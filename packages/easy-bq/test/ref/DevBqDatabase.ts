import { Database, DefaultProvider } from '@thisisagile/easy';

export class DevBqDatabase extends Database {
  static readonly DevBQ = new Database('DevBQ', DefaultProvider, { projectId: 'test-project' });
}
