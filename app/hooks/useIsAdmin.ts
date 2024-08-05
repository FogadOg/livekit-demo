import { useState, useEffect } from "react";
import { getIsAdmin } from "../actions/roomActions";

// Should update on permissions update?
function useIsAdmin(token: string) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminState = async () => {
      setIsAdmin(await getIsAdmin(token));
    };
    fetchAdminState();
  });

  return isAdmin;
}
