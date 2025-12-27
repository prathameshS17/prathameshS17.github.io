import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"
import { logOut } from '../reduxStore/userSlice'
import { useSelector, useDispatch } from "react-redux"
import iconDOC from "/google-docs-icon.png"
import filterIcon from "/filter-icon.png"
import optionIcon from "/options-icon.png"
import {api} from "../api.js"
import "./EditorSkeleton.css"
import {useEffect, useState, useRef} from "react"
import createDocument from "/add-document-2.png"
import Documents from "./Documents.jsx"
import downArrow from "/down-arrow.png"
import collaboratingDocument from "/contract.png"

function Dashboard(){
    // let documentsArray = ["Hello.txt","First.docx","TT","MM","ZZ","XX"]
    let [documentsArray, setDocumentsArray] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state)=>state.user.user)
    const [showOptions, setShowOptions] = useState(false)
    const menuRef = useRef(null)
    const [loading, setIsLoading] = useState(false)
    const [documentMetaData, setDoumentMetaData] = useState(null)

    const onClickSignOut = () =>{
        signOut(auth)
        dispatch(logOut())
        navigate("/")
    }

    useEffect(()=>{
        if(!user) return
        setIsLoading(false)
        const getDocumentMetaData = async()=>{
            try{
                const {error, errorMsg, metaData} = await api.getDocumentMetaData({token:user.token,uid:user.uid})
                if(error==500){
                    throw new Error(`Error ${error}: ${errorMsg}`)
                }  
                let allDocuments = [...metaData.ownedDocument, ...metaData.sharedWithMe]
                setDocumentsArray(allDocuments)
                setDoumentMetaData(metaData)
            }catch(e){
                console.log("Error is../...",e.message)
            }
        }
        getDocumentMetaData().then(()=>{
            setIsLoading(true)
        })
    },[user])

    useEffect(()=>{
        function handleClickOutside(event){
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowOptions(false)
            }
        }

        if (showOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    },[showOptions])

    const openDocument = async(index)=>{
        if(index==null){
            let {id, error, errorMsg} = await api.getUniqueId({token:user.token})
            if(error==null){
                navigate(`/dashboard/editor/${id}/0`)
            }else{
                console.log("error is../..",error,errorMsg)
            }
        }else{
            let id = index
            navigate(`/dashboard/editor/${id}/0`)
        }
    }

    return(
        <div>
            {loading? 
                <>
                    {/* .......................... Menu Bar .................. */}
                    <div className="bg-gray-100 py-6 px-8 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <img src={iconDOC} className="h-10 cursor-pointer" alt="docs-logo"/>
                            {/* Welcome {user.email.split("@")[0]} */}
                            <div className="ql-size-18px">
                                Docs
                            </div>
                        </div>
                        <div onClick={onClickSignOut} className="px-4 py-3 rounded cursor-pointer bg-blue-100 text-sm box-border">
                            Sign Out
                        </div>
                    </div>
                    {
                        documentMetaData ==null?
                            <div className=" h-full mt-32 mx-20 bg-blue-50 py-10 flex flex-col items-center justify-center rounded-xl">
                                <div className="font-semibold ql-size-30px mb-2">You don't have any documents yet</div>
                                <div className="ql-size-14px mb-10">Create your first document to start collaborating in real-time</div>
                                {/* <div className="ql-size-14px">collaborating in real-time</div> */}
                                <img src={collaboratingDocument} className="h-44 w-44 mb-10" alt="collaboratingDocument"/>
                                <div className="bg-blue-500 py-3 px-2 rounded text-white ql-size-16px cursor-pointer" onClick={()=>openDocument(null)}>Create a New document</div>
                            </div>
                        :
                        <>
                            <div className="flex justify-between items-center mt-5 mx-20 cursor-pointer">
                                <div className="font-medium"> Recent Documents</div>
                                <div className="flex items-center text-sm gap-1">
                                    <div>Owned by me</div>
                                    <img src={downArrow} alt="down" className="h-4 w-4 mt-0.5"/>
                                </div>
                            </div>

                            <div className="flex h-full mx-8 mt-7"> 
                                <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 w-full">
                                    <div className="h-72 w-48 col-span-1 mb-5 border hover:border-blue-700 border-gray-400 cursor-pointer mx-auto" onClick={()=>openDocument(null)}>
                                        <div className="h-full flex flex-col justify-center gap-2 items-center" >
                                            <img src={createDocument} alt="" className="h-28 w-28" ></img>
                                            <div className="font-semibold ql-size-16px">Blank document</div>
                                        </div>
                                    </div>
                                    {
                                        documentsArray.map((ele,index)=>{
                                            return (
                                                <div key={index} className="h-72 w-48 col-span-1 mb-5 border hover:border-blue-700 border-gray-400 cursor-pointer mx-auto" onClick={()=>openDocument(ele)}>
                                                    <div className="h-3/4">
                                                        {/* <img src={iconDOC} alt="" className="" ></img> */}
                                                    </div>
                                                    <Documents ele={ele}></Documents>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </>
                    }
                </>
                :
                <div>Loading....</div>
            }
        </div>
    )
}

export default Dashboard