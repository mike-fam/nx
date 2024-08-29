import type { HandlerResult } from './server';
import { getCachedSyncGeneratorChanges } from './sync-generators';

export async function handleGetSyncGeneratorChanges(
  generators: string[]
): Promise<HandlerResult> {
  const changes = await getCachedSyncGeneratorChanges(generators);

  // strip out the content of the changes and any potential callback
  const result = changes.map((change) => ({
    generatorName: change.generatorName,
    changes: change.changes.map((c) => ({ ...c, content: null })),
    outOfSyncMessage: change.outOfSyncMessage,
  }));

  return {
    response: JSON.stringify(result),
    description: 'handleGetSyncGeneratorChanges',
  };
}