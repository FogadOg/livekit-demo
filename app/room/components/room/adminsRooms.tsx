export default function AdminsRooms() {
  const keys = Object.keys(localStorage);

  const roomItems = keys.filter((key) => key.startsWith("room-"));
  const rooms = roomItems.map((room) => room.replace("room-", ""));

  return (
    <>
      <h2>Your rooms:</h2>
      {rooms.map((room) => {
        return (
          <div key={room}>
            <h2>Room id {room}</h2>
            <button className="btn btn-error">Delete room</button>
            <p>Room participants: </p>
          </div>
        );
      })}
    </>
  );
}
