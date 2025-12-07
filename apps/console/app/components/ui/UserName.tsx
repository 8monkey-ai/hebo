import { useSnapshot } from "valtio";

import { shellStore } from "~console/state/auth";

export function UserName() {
  const { user } = useSnapshot(shellStore);

  return <span>{user?.name}</span>;
}
