import { useState, useEffect } from "react";
import { getIsAdmin } from "../actions/roomActions";

function useFriendStatus(token: string) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminState = async () => {
      setIsAdmin(await getIsAdmin(token));
    };
  });

  return isAdmin;
}
