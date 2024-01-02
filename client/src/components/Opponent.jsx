"use client"
import Tile from "./Tile"
import React from "react"


const Opponent = ({grid}) => {    

    //Represent tile grid with matrix of objects
    //id property present to help react render when tiles move position; id = index in matrix
    

    return (
        <div>

            <div className="flex flex-col justify-around bg-rose-300 p-4 rounded opponent-tile-grid">
            {grid.map( newRow => (
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

export default Opponent