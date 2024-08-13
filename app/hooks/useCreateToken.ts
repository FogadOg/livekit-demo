import { useState, useEffect } from "react";

export default function useCreateToken() {
  const [hasCreateToken, setHasCreateToken] = useState(false);
  const [gettingCreateToken, setGettingCreateToken] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const createToken = localStorage.getItem("createToken");
      setHasCreateToken(!!createToken);
      setGettingCreateToken(false);
    }
  }, []);

  return { hasCreateToken, gettingCreateToken };
}
