import { useLiveQuery } from "dexie-react-hooks";

import { deriveIsUnexported, getMetadata } from "@/lib/storage/metadata";

export function useUnexportedChanges() {
  const metadata = useLiveQuery(() => getMetadata(), []);
  const hasUnexportedChanges = deriveIsUnexported(metadata);

  return { metadata, hasUnexportedChanges };
}
