import renameTab from "/rename-icon.png"
import trashTab from "/trash-icon.png"
import openInNewTab from "/open-in-new-window-icon.png"
import iconDOC from "/google-docs-icon.png"
import optionIcon from "/options-icon.png"
import { useRef, useEffect, useState } from "react"

const Documents = ({ele})=>{
    let [showOptions, setShowOptions] = useState(false)
    let menuRef = useRef(null)

    useEffect(()=>{
        const handleClickOutside = (event)=>{
            if(menuRef.current && !menuRef.current.contains(event.target)){
                setShowOptions(false)
            }
        }
        if(showOptions){
            document.addEventListener("mousedown",handleClickOutside)
        }else{
            document.removeEventListener("mousedown",handleClickOutside)
        }
        return ()=>{
            document.removeEventListener("mousedown",handleClickOutside)
        }
    }, [showOptions])

    return (
        <div className="h-1/4 py-2 border-t border-gray-400 ql-size-14px relative">
            <div className="px-3 mb-0.5">{ele}</div>
            <div className="flex justify-between items-center px-2 gap-0.5">
                <div className="flex items-center gap-0.5">
                    <img src={iconDOC} alt="" className="h-6 w-6"/>
                    <div className="ql-size-10px">Opened Sept 31, 2025</div>
                </div>
                <div className="h-7 w-7 rounded-full hover:bg-gray-200" onClick={(e)=>{e.stopPropagation();setShowOptions((prev)=>!prev)}}>
                    <img src = {optionIcon} className="h-full w-full rounded-full p-1.5"/>
                </div>
                {showOptions && 
                    <div ref={menuRef} className="absolute rounded bg-white flex flex-col gap-3 -right-10 bottom-10 shadow py-5 px-6 ql-size-16px z-10">
                        <div className="flex items-center gap-2"><img src={renameTab} className="h-5 w-5" alt=""/>Rename</div>
                        <div className="flex items-center gap-2"><img src={trashTab} className="h-5 w-5" alt=""/>Remove</div>
                        <div className="flex items-center gap-2"><img src={openInNewTab} className="h-5 w-5" alt=""/>Open in new tab</div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Documents