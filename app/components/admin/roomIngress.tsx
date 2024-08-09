import { createIngress } from "@/app/actions/adminActions";
import { Room } from "livekit-server-sdk";
import { FormEvent, useState } from "react";

export default function RoomIngress({
  room,
  adminToken,
}: {
  room: Room;
  adminToken: string;
}) {
  const [username, setUsername] = useState("");
  const [ingressUrl, setIngressUrl] = useState("");
  const [ingressPassword, setIngressPassword] = useState("");

  const startIngress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { valid, url, password } = await createIngress(
      adminToken,
      room,
      username
    );
    if (valid) {
      setIngressUrl(url!);
      setIngressPassword(password!);
    }
  };
  return (
    <form onSubmit={startIngress}>
      <input
        id="username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered"
        required
      />
      <input
        type="submit"
        className="btn btn-primary"
        value={"Start ingress"}
      />
      {ingressUrl !== "" && <p>Ingress url: {ingressUrl}</p>}
      {ingressPassword !== "" && <p>Ingres password: {ingressPassword}</p>}
    </form>
  );
}
