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
  const [ingressUrl, setIngressUrl] = useState("");
  const [ingressPassword, setIngressPassword] = useState("");

  const startIngress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let username = prompt("username")
    if(username !== null){
      const { valid, url, password } = await createIngress(
        adminToken,
        room,
        username
      );
      if (valid) {
        setIngressUrl(url!);
        setIngressPassword(password!);
      } else {
        window.location.reload;
      }

    }
  };
  return (
    <form onSubmit={startIngress}>
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