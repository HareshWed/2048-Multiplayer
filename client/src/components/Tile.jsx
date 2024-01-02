const Tile = ({text, expand}) => {

    const getNumberStyle = (num) => {
        switch(num){
            case "":
                return "bg-slate-200 opacity-50" 
            case 2:
                return "text-5xl bg-amber-50 text-gray-500"
            case 4:
                return "text-5xl bg-amber-100 text-gray-500"
            case 8:
                return "text-5xl bg-orange-300 text-white"
            case 16:
                return "text-5xl bg-orange-400 text-white"
            case 32:
                return "text-5xl bg-red-400 text-white"
            case 64:
                return "text-5xl bg-red-600 text-white" 
            case 128:
                return "text-5xl bg-amber-200 text-white"
            case 256:
                return "text-5xl bg-amber-300 text-white"
            case 512:
                return "text-5xl bg-yellow-300 text-white"
            case 1024:
                return "text-4xl bg-yellow-400 text-white"
            case 2048:
                return "text-4xl bg-yellow-400 text-white" 
            default:
                return ""
        }
    }
    return (
        <div className={`rounded player-num-tile ${getNumberStyle(text)} ${expand}`}>{text}</div>
    )

}

export default Tile

