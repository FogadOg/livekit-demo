import { Modal } from "../../modal";
import { PermissionControls } from "./permissionControls";
import { InviteUsersForm } from "./inviteUsersForm";
import { RecordButton } from "./recordButton";
import { PeopleIcon } from "@/app/assets/peopleIcon";
import { InviteIcon } from "@/app/assets/inviteIcon";
import { addMetadataToRoom, getRoomMetadata } from "@/app/actions/roomMetadata";
import { useRoomInfo } from "@livekit/components-react";

export const AdminControls = ({ token }: { token: string }) => {
  const roomInfo = useRoomInfo()
  
  async function handlePause (){
    const roomMetaData = await getRoomMetadata(roomInfo.name)
    
    try{
      const parsedData = JSON.parse(roomMetaData)
      if(parsedData["pause"] === "false") {
        addMetadataToRoom(roomInfo.name, "pause", "true")
      } else {
        addMetadataToRoom(roomInfo.name, "pause", "false")
      }
    }catch{
      addMetadataToRoom(roomInfo.name, "pause", "false")

    }

    
  }
  return (
    <>
      <Modal
        title="Users permissions"
        content={<PermissionControls token={token} />}
        buttonText="Users permissions"
        modelName="PermissionControls"
        icon={<PeopleIcon />}
      />
      <RecordButton token={token} />

      {/* Invite users */}
      <Modal
        title="Permissions of invite link"
        content={<InviteUsersForm token={token} />}
        buttonText={"Invite users"}
        modelName="InviteUsers"
        icon={<InviteIcon />}
      />
      <button onClick={handlePause}>Pause</button>
    </>
  );
};
