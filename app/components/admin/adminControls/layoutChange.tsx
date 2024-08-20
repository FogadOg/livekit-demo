import { addMetadataToRoom } from "@/app/actions/metadataAction"
import { useRoomInfo } from "@livekit/components-react"




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
            <button className="btn lk-button" onClick={changeToGridLayout}>Change to grid layout</button>
            <button className="btn lk-button" onClick={changeToSpeakerLayout}>Change to speaker layout</button>
        </div>
    )
}

