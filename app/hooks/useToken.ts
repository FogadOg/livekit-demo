import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function useToken() {
  const searchParams = useSearchParams();

  const permissionsToken = searchParams.get("permissionsToken");
  const roomId = searchParams.get("roomId");
  const adminToken = localStorage.getItem("roomAdmin-" + roomId);

  const [token, setToken] = useState(adminToken ? adminToken : "");

  return { token, setToken, permissionsToken };
}
