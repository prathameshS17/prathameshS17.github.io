import { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import ImageResize from 'quill-image-resize-module-react'
import 'quill/dist/quill.snow.css'
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'
import QuillCursors from 'quill-cursors';
import "./EditorSkeleton.css"
import iconDOC from "/google-docs-icon.png"
import iconHistory from "/history-1.png"
import iconDropdown from "/down-arrow.png"
import Editor from "./Editor"
import { useParams } from 'react-router-dom'
import { getAuth } from "firebase/auth"
import { useSelector } from 'react-redux'
import {api} from "../api.js"
import favorite from "/favorite.svg"
import cloudCheck from "/cloud-check-normal.png"
import cloudSync from "/sync-normal.png"

function EditorSkeleton() {
  const editorRef = useRef()
  const [quill, setQuill] = useState(null)
  const [savedStatus, setSavedStatus] = useState(null)
  const [imageTitle, setTitle] = useState("Untitled Document")
  const { id } = useParams()
  const user = useSelector((state)=>state.user.user)
  let alreadySaved = false
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(()=>{
    if(!user) return
    const changeDocumentName = async()=>{
      const {error, errorMsg, savedDocumentName} = await api.saveDocumentName({token:user.token,id, name:imageTitle})
    }
    changeDocumentName()
  },[imageTitle,user])

  useEffect(() => {
    const Size = Quill.import('formats/size');
    Size.whitelist = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px','24px', '30px', '36px', '48px'];
    Quill.register(Size, true);

    const Font = Quill.import('formats/font')
    Font.whitelist = ['sans', 'serif', 'monospace','roboto','arial','calibri','helvetica','verdana', 'segoe','nunito']
    Quill.register(Font, true)

    Quill.register('modules/cursors', QuillCursors);
    Quill.register('modules/imageResize', ImageResize);

    const editorDiv = document.createElement('div')
    editorDiv.classList.add("page")
    editorRef.current.append(editorDiv)

    const quillInstance = new Quill(editorDiv, {
      theme: 'snow',
      modules: {
        toolbar:"#toolbar",
        cursors: true,
        imageResize: {
            modules: ['Resize', 'DisplaySize']
        }
      }
    })

    setQuill(quillInstance)
  }, [])

  useEffect(() => {
    if (!quill || !user) return
    const token = user.token
    const ydoc = new Y.Doc()

    async function loadCurrentDocument(){
      try{
        const {error, errorMsg, snapshot, updates,name} = await api.loadDocument({token, id})
        if(error==null){
          alreadySaved = true
        }
        console.log("The name is....../...........",name)
        setTitle(name)
        if (snapshot) {
          const snap = Uint8Array.from(atob(snapshot), c => c.charCodeAt(0));
          Y.applyUpdate(ydoc, snap)
        }
        if(updates.length){
          updates.forEach(u => {
            const update = Uint8Array.from(atob(u), c => c.charCodeAt(0));
            Y.applyUpdate(ydoc, update);
          });
        }
      }catch(e){
        console.log({error:500, errorMsg:e.message, snapshot:null,updates:null})
      }
    }
    loadCurrentDocument()

    async function getColor (){
      try{
        const {error, errorMsg, color} = await api.getColor({token})
        if(error){
          throw new Error("Unable to get color")
        }
        return `#${color}`
      }catch(e){
        console.log("Got error in color../...")
      }
    }

    const provider = new WebsocketProvider('ws://localhost:8080', `${id}`, ydoc)
    const ytext = ydoc.getText('quill')

    const awareness = provider.awareness
    const binding = new QuillBinding(ytext, quill, awareness)

    getColor().then((color) => {
        awareness.setLocalStateField("user", {
          name: user.userName,
          color: color || "#ff6b6b",
        });
    });


    let lastSavedState = Y.encodeStateVector(ydoc)
    let saveTimer = null
    let updateCount = 0
    const SNAPSHOT_INTERVAL = 10

    function scheduleSave() {
      setSavedStatus(false)
      clearTimeout(saveTimer)
      saveTimer = setTimeout(async () => {
        const diff = Y.encodeStateAsUpdate(ydoc, lastSavedState)
        if (diff.byteLength > 0) {
          updateCount++
          try{
            if(updateCount>=SNAPSHOT_INTERVAL){
              const snapshot = Y.encodeStateAsUpdate(ydoc)
              const {error, errorMsg, savedWholeDocument} = await api.saveDocumentSnapshot({token, id, snapshot})
              if(error){
                throw new Error("Unable to save data")
              }
              updateCount = 0
            }else{
              if(!alreadySaved){
                const {userName:ownerName, email: ownerEmail, uid: ownerId} = user
                const {error, errorMsg, saveDocumentMetaData} = await api.saveDocumentMetaData({token, id, ownerName, ownerEmail, ownerId})
                if(error){
                  throw new Error(errorMsg)
                }
              }
              const {error, errorMsg, saved} = await api.saveDocument({token, id, diff})
              if(error){
                throw new Error(errorMsg)
              }
            }
            setSavedStatus(true)
          }catch(e){
            console.log("Error is../...",e.message)
          }

          lastSavedState = Y.encodeStateVector(ydoc)
          console.log("✅ Changes saved to backend")
        }
      }, 500)
    }

    ydoc.on("update", scheduleSave)

    return () => {
      provider.destroy()
      ydoc.destroy()
    }
  }, [quill,user])

  const changeTitle  = async(event)=>{
    setTitle(event.target.value)
  }

  const handleChange = ()=>{
    // const qlContainer = ref.current.querySelector('.ql-container')
    // const qlEditor = ref.current.querySelector('.ql-editor')

    // if (qlContainer && qlEditor) {
    //     console.log('ql-container height:', qlContainer.offsetHeight,qlEditor.offsetHeight)
    // }
  }

  return (
    <div className='mx-5 mt-5'>
      
      {/* .............. titlebar .................. */}
      <div className='flex justify-between mb-5 gap-2'>
        <div className='flex gap-1'>
          <img src={iconDOC} className="h-10 cursor-pointer" alt="docs-logo"/>
          <div className='flex justify-center items-center'> 
            {/* field-sizing: content only works in chromium based browser. Hence using this manual based method, if using this method , no need to set min-w and max-w */}
            <input type='text' value={imageTitle} onChange={changeTitle} style={{ width: `${Math.min(imageTitle.length * 8 + 16, 480)}px` }}  className='min-w-28 max-w-96 px-1 '/>
          </div>

          {
            savedStatus === false?
              <div className='flex my-auto text-xs gap-1 ml-2'>
                <img src={cloudSync} alt="cloud-saving" className="h-4 w-4"/>
                <div className='mt-0.5'>Saving ... </div> 
              </div>
            : savedStatus=== true?
              <div className='flex my-auto text-xs gap-1 ml-2'>
                <img src={cloudCheck} alt="cloud-saving" className="h-5 w-5"/>
                <div className='mt-0.5'>Saved to database </div> 
              </div>:<></>
          }

        </div>

        <div className='flex justify-between gap-5'>
          <div className="my-auto">
              <img src={favorite} alt="favorite-svg" className="h-4 w-4"/>
          </div>
          <img src={iconHistory} className='h-6 my-auto cursor-pointer' alt="history-icon"></img>
          <div className='bg-blue-100 w-32 h-10 my-auto rounded-full flex justify-around items-center'>
            <div className='cursor-pointer'>
              Share
            </div>
            <div className='flex justify-center items-center h-full border-l-2 border-white pl-2'>
              <img src = {iconDropdown} alt="iconDropdown" className='h-4 w-4 cursor-pointer'/>
            </div>
          </div>
          <div className='my-auto flex h-8 w-8 rounded-full bg-amber-300 items-center justify-center cursor-pointer'>
            PS
          </div>
        </div>
      </div>

      <div id="toolbar" className="mb-6 bg-blue-50 py-1 rounded-full !border-0 !flex">
        <div className='!px-2 border-r-2 border-white'>
          <select className='ql-header'/>
        </div>

        <div className='!px-2 border-r-2 border-white'>
          <select className="ql-font">
            <option value="arial">Arial</option>
            <option value="calibri">Calibri</option>
            <option value="helvetica">Helvetica</option>
            <option value="monospace">Monospace</option>
            <option value="nunito">Nunito</option>
            <option value="roboto">Roboto</option>
            <option value="sans">Sans</option>
            <option value="segoe">Segoe UI</option>
            <option value="serif">Serif</option>
            <option value="verdana">Verdana</option>
          </select>
        </div>

        <div className='!px-2 border-r-2 border-white'>
          <select className="ql-size !w-12">
            <option value="8px">8</option>
            <option value="9px">9</option>
            <option value="10px">10</option>
            <option value="11px">11</option>
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="24px">24</option>
            <option value="30px">30</option>
            <option value="36px">36</option>
            <option value="48px">48</option>
          </select>
        </div>

        <div className='!px-2 border-r-2 border-white'>
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className='ql-strike'/>
        </div>

        <div className='!px-2 border-r-2 border-white'>
          <button className='ql-color'/>
          <button className='ql-background'/>
        </div>

        <div className='!px-2 border-r-2 border-white'>
          <button className='ql-link'/>
          <button className='ql-image'/>
          <button className='ql-video'/>
          <button className='ql-formula '/>
        </div>

        <div className='!px-2 border-r-2 border-white'>
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className='ql-list ' value="check"/>
        </div>

        <div className='!px-2 border-r-2 border-white'>
          <button className='ql-indent' value="-1"/>
          <button className='ql-indent' value="+1"/>
          <button className="ql-direction" value="rtl"/>
          <select className="ql-align" />
          <button className="ql-clean" />
        </div>
      </div>

      {/* <div ref={editorRef} style={{ height: '100vh' }} /> */}
      {/* .............. Editor .................. */}
      <div className='flex justify-center'>
        <Editor  ref={editorRef} handleChange={handleChange}/>
      </div>
    </div>
  )
}

export default EditorSkeleton
