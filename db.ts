
import Dexie, { type EntityTable } from 'dexie';
import { SessionRecord, GeneratedContentRecord } from './types';

const db = new Dexie('RepurposerDB') as Dexie & {
  sessions: EntityTable<SessionRecord, 'id'>;
  generatedContents: EntityTable<GeneratedContentRecord, 'id'>;
};

db.version(1).stores({
  sessions: '++id, url, title, timestamp',
  generatedContents: '++id, sessionId, platform, timestamp'
});

export { db };
