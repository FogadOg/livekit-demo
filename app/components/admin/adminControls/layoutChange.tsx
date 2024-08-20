import { addMetadataToRoom } from "@/app/actions/metadataAction"
import { useRoomInfo } from "@livekit/components-react"
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';


export const LayoutChange = () => {
    const roomInfo = useRoomInfo()
    function changeToGridLayout() {
        addMetadataToRoom(roomInfo.name, "layout", "grid")
        console.log(roomInfo.metadata);
    }
    function changeToSpeakerLayout() {
        addMetadataToRoom(roomInfo.name, "layout", "speaker")
        console.log(roomInfo.metadata);
        
    }
    return (
        <div>
            <button className="btn lk-button" onClick={changeToGridLayout}>
                <ViewModuleIcon/>
            </button>
            <button className="btn lk-button" onClick={changeToSpeakerLayout}>
                <ViewSidebarIcon/>
            </button>
        </div>
    )
}

