import { useState } from "react"

const JoinRoom = ({sock, changeRoom, room}) => {
    const [animateRoom, setAnimateRoom] = useState(false)
    const join = (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const currRoom = data.get('room').trim()
        sock.emit("Join room", currRoom)
        changeRoom(currRoom)
        setAnimateRoom(true)
        setTimeout(() => {
            	setAnimateRoom(false)
        }, "2500")
    }
    return (
        <div className="flex">
        <form onSubmit={join}>
            <input type="text" name="room" placeholder="Room Name" className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-80 h-12 m-5"/>
            <input type="submit" value="Join Room" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"/>
        </form>
        <h3 className={`${room? "room-display": ""} ${animateRoom? "animate-room" : ""} bg-orange-300`}>{room}</h3>
        </div>

    )
}
export default JoinRoom