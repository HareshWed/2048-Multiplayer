import TileGrid from "./components/NumberGrid"
import JoinRoom from "./components/Room"
import Opponent from "./components/Opponent"
import { useState, useEffect } from "react"
import {io} from 'socket.io-client'

function App() {
  const [socket, setSocket] = useState(null)
  const [room, setRoom] = useState(null)
  const [gameStatus, setGameStatus] = useState("")
  const [displayMessage, setDisplayMessage] = useState("")
  const [opponentTiles, setOpponentTiles] = useState([
    [   {id: 0, val: "", expand: ""},
        {id: 1, val: "", expand: ""},
        {id: 2, val: "", expand: ""},
        {id: 3, val: "", expand: ""}
    ],
    [   {id: 4, val: "", expand: ""},
        {id: 5, val: "", expand: ""},
        {id: 6, val: "", expand: ""},
        {id:7, val: "", expand: ""}
    ],
    [
        {id: 8, val: "", expand: ""},
        {id: 9, val: "", expand: ""},
        {id: 10, val: "", expand: ""},
        {id: 11, val: "", expand: ""}
    ],
    [   {id: 12, val: "", expand: ""},
        {id: 13, val: "", expand: ""},
        {id: 14, val: "", expand: ""},
        {id: 15, val: ""}
    ]
])

  useEffect(()=>{
    if(!socket){
      const s = io('http://localhost:5000')
      s.on('connect', ()=>{
        console.log(s.id)
      })
      s.on('Opp move', (grid) => {
        console.log("Opponent moved!")
        setOpponentTiles(grid)
        })
      setSocket(s)
    }
  },[socket])

  return (
    <div>
      <JoinRoom sock={socket} changeRoom={setRoom} room={room} />
      <div className="flex flex-row justify-center">
        <TileGrid sock={socket} room={room} gameStatus={gameStatus} setDisplayMessage={setDisplayMessage} setGameStatus={setGameStatus}/>
        <Opponent grid={opponentTiles}/>
      </div>
      <div className={`${gameStatus}`}>
        {displayMessage}
      </div>
    </div>
    
  );
}

export default App;
