"use client"
import Tile from "./Tile"
import React, {useState} from "react"
import { useEffect } from "react"
import { Socket } from "socket.io-client"

const TileGrid = ({sock, room, gameStatus, setGameStatus, setDisplayMessage}) => {    

    //Represent tile grid with matrix of objects
    //id property present to help react render when tiles move position; id = index in matrix
    const [numberTiles, setNumberTiles] = useState([
            [   {id: 0, val: "", expand: ""},
                {id: 1, val: "", expand: ""},
                {id: 2, val: "", expand: ""},
                {id: 3, val: "", expand: ""}
            ],
            [   {id: 4, val: "", expand: ""},
                {id: 5, val: 2, expand: ""},
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
                {id: 13, val: 2, expand: ""},
                {id: 14, val: "", expand: ""},
                {id: 15, val: ""}
            ]
    ])

    

    if(sock){
        sock.on("Opp won", () => {
            setGameStatus("game-over")
            setDisplayMessage("You lost ;(")
        })
        sock.on("Opp lost", () => {
            setGameStatus("game-win")
            setDisplayMessage("You Won!")
        }) 
    }
    const winningScore = 256

    const numRows = numberTiles.length
    const numCols = numberTiles[0].length

    const moveLeft = (grid) => {
        const updateGrid = []

        for(let i = 0; i < numRows; i++){
            let currRow = grid[i]
            const newRow = []
            let j = 0          
    
            while(j < currRow.length - 1){
                //Find index of next tile to the right that has a number
                let next_index = j + 1
                while(currRow[next_index]['val'] === "" && next_index < currRow.length - 1){
                    next_index += 1
                }
                //Add numbers of horizontally adjacent tiles if equal
                if(currRow[j]['val'] === currRow[next_index]['val']){
                    newRow.push({ id: (i*numRows) + newRow.length, 
                        val: currRow[j]['val'] + currRow[next_index]['val'],
                        expand: "expand-grow"
                    })
                    if(currRow[j]['val']==""){
                        newRow[newRow.length-1]['expand'] = ""
                    }
                    //Make the right tile of tiles added empty
                    currRow[next_index]['val'] = ""

                    j = next_index
                }
                //Otherwise add current tile if not empty
                else if(currRow[j]['val'] != ""){
                    newRow.push({ id: (i*numRows) + newRow.length, 
                        val: currRow[j]['val'],
                        expand: ""
                    })
                }
                j += 1
            }
            //Handle tiles at right edges and add tile if it is the same as the combined tiles to the left
            if(currRow[numRows-1] != newRow[newRow.length-1]){
                newRow.push({ id: (i*numRows) + newRow.length, 
                    val: currRow[numRows-1]['val'],
                    expand: ""
                })
            }
            else{
                newRow[newRow.length-1] = { id: (i*numRows) + newRow.length, 
                    val: currRow[numRows-1]['val'] + newRow[newRow.length-1]['val'],
                    expand: "expand-grow"
                }
            }
            //Padd rows with empty tiles
            const tileDiff = numRows - newRow.length
            for(let k = 0; k < tileDiff; k++){
                newRow.push({ id: (i*numRows) + newRow.length, 
                    val: "", 
                    expand: ""
                })
            }
            updateGrid.push(newRow)
        }
        return updateGrid
    }

    const moveRight = (grid) => {
        const updateGrid = []

        for(let i = 0; i < numRows; i++){
            let currRow = grid[i]
            let newRow = []
            let j = currRow.length - 1  
            //Find index of next tile to the left that has a number          
            while(j > 0){
                let next_index = j - 1
                while(currRow[next_index]['val'] === "" && next_index > 0){
                    next_index -= 1
                }
                //Add numbers of horizontally adjacent tiles if equal
                if(currRow[j]['val'] === currRow[next_index]['val']){
                    newRow.push({ id: (i*currRow.length) + (currRow.length - 1 - newRow.length), 
                        val: currRow[j]['val'] + currRow[next_index]['val'],
                        expand: "expand-grow"
                    })
                    if(currRow[j]['val']==""){
                        newRow[newRow.length-1]['expand'] = ""
                    }
                    //Make the left tile of tiles added empty
                    currRow[next_index]['val'] = ""
                    j -= 1
                }
                //Otherwise add current tile if not empty
                else if(currRow[j]['val'] != ""){
                    newRow.push({ id: (i*currRow.length) + (currRow.length - 1 - newRow.length), 
                        val: currRow[j]['val'],
                        expand: ""
                    })
                }
                j -= 1
            }
            //Handle tiles at left edges
            if(currRow[0] != newRow[newRow.length-1]){
                newRow.push({ id: (i*currRow.length) + (currRow.length - 1 - newRow.length), 
                    val: currRow[0]['val'],
                    expand: ""
                })
            }
            else{
                newRow[newRow.length-1] = { id: (i*currRow.length) + newRow.length, 
                    val: currRow[0]['val'] + newRow[newRow.length-1]['val'],
                    expand: "expand-grow"
                }
            }
            //Get tiles with numbers and reverse order to move tiles to the right
            newRow = newRow.filter((tile) => tile['val'] != "")
            newRow.reverse()
            //Padd rows with empty tiles
            const tileDiff = currRow.length - newRow.length
            const padding = []
            for(let k = 0; k < tileDiff; k++){
                padding.push({ id: (i*currRow.length) + k, 
                    val: "",
                    expand: ""
                })
            }
            newRow = [...padding, ...newRow]
            //Correct id of each tile
            for(let k = 0; k < newRow.length; k++){
                newRow[k]['id'] = (i*currRow.length) + k
            }
            updateGrid.push(newRow)
        }
        return updateGrid
    }

    const moveUp = (grid) => {
        //Create empty matrix to add columns to 
        const updateGrid = []
        for (let i = 0; i < numRows; i++){
            updateGrid.push([])
        }

        for(let j = 0; j < numCols; j++){
            const col = []
            let i = 0
            //Find index of next tile to the bottom that has a number
            while(i < numRows - 1){
                let next_index = i + 1
                while(grid[next_index][j]['val'] === "" && next_index < numRows - 1){
                    next_index += 1
                }
                //Add numbers of vertically adjacent tiles if equal
                if((grid[i][j]['val'] == grid[next_index][j]['val'])){
                    col.push({
                        id: (col.length * numCols) + j,
                        val: grid[i][j]['val'] + grid[next_index][j]['val'],
                        expand: "expand-grow"
                    })
                    if(grid[i][j]['val'] == ""){
                        col[col.length-1]['expand'] = ""
                    }
                    //Make the bottom tile of tiles added empty
                    grid[next_index][j]['val'] = ""
                    i = next_index
                }
                //Otherwise add current tile if not empty
                else if(grid[i][j]['val'] != ""){
                    col.push({
                        id: (col.length * numCols) + j,
                        val: grid[i][j]['val'],
                        expand: ""
                    })
                }
                i += 1
            }
            //Handle tiles at bottom edges
            if(col[col.length-1] != grid[numRows-1][j]){
                col.push({
                    id: (col.length * numCols) + j,
                    val: grid[numRows-1][j]['val'],
                    expand: ""
                })
            }
            else{
                col[col.length-1] = {
                    id: (col.length * numCols) + j,
                    val: col[col.length-1]['val'] + grid[numRows-1][j]['val'],
                    expand: "expand-grow"
                }
            }
            //Padd columns with empty tiles
            const tileDiff = numRows - col.length
            for(let k = 0; k < tileDiff; k++){
                col.push({
                    id: (col.length * numCols) + j,
                    val: "",
                    expand: ""
                })
            }

            for(let k = 0; k < numRows; k++){
                updateGrid[k].push(col[k])
            }
        }
        return updateGrid
    }

    const moveDown = (grid) => {
        //Create empty matrix to add columns to 
        const updateGrid = []
        for (let i = 0; i < numRows; i++){
            updateGrid.push([])
        }
        for(let j = 0; j < numCols; j++){
            let col = []
            let i = numRows - 1
            //Find index of next tile to the top that has a number
            while(i > 0){
                let next_index = i - 1
                while(grid[next_index][j]['val'] === "" && next_index > 0){
                    next_index -= 1
                }
                //Add numbers of vertically adjacent tiles if equal
                if(grid[i][j]['val'] == grid[next_index][j]['val']){
                    col.push({
                        id: (col.length * numCols) + j,
                        val: grid[i][j]['val'] + grid[next_index][j]['val'],
                        expand: "expand-grow"
                    })
                    if(grid[i][j]['val'] == ""){
                        col[col.length-1]['expand'] = ""
                    }
                    //Make the top tile of tiles added empty
                    grid[next_index][j]['val'] = ""
                    i -= 1
                }
                //Otherwise add current tile if not empty
                else if(grid[i][j]['val'] != ""){
                    col.push({
                        id: (col.length * numCols) + j,
                        val: grid[i][j]['val'],
                        expand: ""
                    })
                }
                i -= 1
            }
            //Handle tiles at top edges
            if(col[col.length-1] != grid[0][j]){
                col.push({
                    id: (col.length * numCols) + j,
                    val: grid[0][j]['val'],
                    expand: ""
                })
            }
            else{
                col[col.length-1] = {
                    id: (col.length * numCols) + j,
                    val: col[col.length-1]['val'] + grid[0][j]['val'],
                    expand: "expand-grow"
                }
            }
            //Get tiles with numbers and reverse order to move tiles to the bottom
            col = col.filter((tile) => tile['val'] != "")
            col.reverse()
            //Padd columns with empty tiles
            const tileDiff = numRows - col.length
            const padding = []
            for(let k = 0; k < tileDiff; k++){
                padding.push({
                    id: (k * numCols) + j,
                    val: "",
                    expand: ""
                })
            }
            const newCol = [...padding, ...col]
            for(let k = 0; k < numRows; k++){
                //Correct id of each tile
                newCol[k]['id'] = (k * numRows) + j
                updateGrid[k].push(newCol[k])
            }
        }
        return updateGrid
    }

    const getEmptyIndices = (tileGrid) => {
        const empty = []
        for (let i = 0; i < numRows; i++){
            for (let j = 0; j < numCols; j++){
                if(tileGrid[i][j]['val'] === ""){
                    empty.push((i*numRows) + j)
                }
            }
        }
        return empty
    }

    const checkEqual = (arr1, arr2) => {
        for(let i = 0; i < numRows; i++){
            for(let j = 0; j < numCols; j++){
                if(arr1[i][j]['val']!=arr2[i][j]['val']){
                    return false
                }
            }
        }
        return true
    }

    const checkGameStatus = (grid) => {
        for(let i = 0; i < numRows; i++){
            for(let j = 0; j < numCols; j++){
                if(grid[i][j]["val"] == winningScore){
                    setGameStatus("game-win")
                    setDisplayMessage("You Won!")
                    sock.emit("Opponent won", room)
                    return 
                }
            }
        }
        const emptyTiles = getEmptyIndices(grid)
        if(emptyTiles.length > 0){
            return 
        }
        for(let i = 0; i < numRows; i++){
            for(let j = 0; j < numCols; j++){
                if(i < numRows-1){
                    if(grid[i][j]["val"] == grid[i+1][j]["val"]){
                        return
                    }
                }
                if (j < numCols-1){
                    if(grid[i][j]["val"] == grid[i][j+1]["val"]){
                        return
                    }
                }
            }
        }
        setGameStatus("game-over")
        setDisplayMessage("Game Over!")
        sock.emit("Opponent lost", room)
    }
    useEffect( () => {
        const moveTiles = (e) =>{
            let currentGrid = [...numberTiles]
            let updateGrid = [...numberTiles]
            if(e.key == "ArrowLeft"){
                updateGrid = moveLeft(currentGrid)
            }
            else if(e.key == "ArrowUp"){
                updateGrid = moveUp(currentGrid)
            }
            else if(e.key == "ArrowRight"){
                updateGrid = moveRight(currentGrid)
            }
            else if(e.key == "ArrowDown"){
                updateGrid = moveDown(currentGrid)
            }   
            const unchanged = checkEqual(currentGrid, updateGrid)
            if (!unchanged){
                const emptyTiles = getEmptyIndices(updateGrid)
                const randIndex = emptyTiles[Math.floor(Math.random()*emptyTiles.length)]
                updateGrid[Math.floor(randIndex/numRows)][randIndex%numCols]['val'] = 2
                updateGrid[Math.floor(randIndex/numRows)][randIndex%numCols]['expand'] = "expand-grow"
                if(sock){
                    sock.emit("Opponent moved", {grid: updateGrid, room:room})
                }
            }
            setNumberTiles(updateGrid)
            checkGameStatus(updateGrid)
        }
        if(gameStatus != "game-win"){
            window.addEventListener("keydown", moveTiles)
        }
        return () => {
            window.removeEventListener("keydown", moveTiles)
        }
    }, [numberTiles])

    return (
        <div>
            <div className="font-bold text-slate-600 text-xl">{`You need ${winningScore} to win`}</div>
            <div className="flex flex-col justify-around bg-rose-300 p-4 rounded player-tile-grid">
            {numberTiles.map( newRow => (
                <div className="flex flex-newRow justify-around p-2">
                    {
                        newRow.map( tileNum => (
                            <Tile text={tileNum.val} key={tileNum.id} expand={tileNum.expand}/>
                        ))
                    }
                </div>
            )
            )}
        </div>
        </div>
    )
}

export default TileGrid