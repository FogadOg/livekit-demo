import {
  ControlBar,
  ControlBarProps,
  useLocalParticipantPermissions,
} from "@livekit/components-react";

import { TrackSource } from "livekit-server-sdk";
import useIsAdmin from "@/app/hooks/useIsAdmin";
import { AdminControls } from "./admin/adminControls";
import { Modal } from "./modal";
import { PauseButton } from "./admin/adminControls/pauseButton";
import { ReactionHandler } from "./reactionHandler";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface CustomControlBarProps extends ControlBarProps {
  token: string;
}

export function CustomControlBar({ token, ...props }: CustomControlBarProps) {
  const permissions = useLocalParticipantPermissions();
  const isAdmin = useIsAdmin(token);

  return (
    <div className="lk-control-bar">
      {isAdmin && (
        <>
          <Modal
            title="Admin panel"
            content={<AdminControls token={token} />}
            buttonText={              
              <>
                <AdminPanelSettingsIcon /> View admin panel
              </>
            }
            modelName="adminPanel"
          />
          <PauseButton />
        </>
      )}
      {permissions?.canPublishData && <ReactionHandler />}
      <ControlBar
        controls={{
          camera: permissions?.canPublishSources.includes(TrackSource.CAMERA),
          screenShare: permissions?.canPublishSources.includes(
            TrackSource.SCREEN_SHARE
          ),
          microphone: permissions?.canPublishSources.includes(
            TrackSource.MICROPHONE
          ),
        }}
        {...props}
      />
    </div>
  );
}
