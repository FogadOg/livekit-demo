import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function useToken() {
  const searchParams = useSearchParams();

  const permissionsToken = searchParams.get("permissionsToken");
  const roomId = searchParams.get("roomId");

  const [token, setToken] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      // This code will only run in the browser
      const adminToken = localStorage.getItem("roomAdmin-" + roomId);
      if (adminToken) {
        setToken(adminToken);
      }
    }
  }, [roomId, permissionsToken]);

  return { token, setToken, permissionsToken };
}
