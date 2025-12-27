const API_SERVER = import.meta.env.VITE_API_SERVER;

const getUniqueId = async({token})=>{
    try{
        const response = await fetch(`${API_SERVER}/getID`,{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        if(!response.ok){
            throw new Error(`HTTP${response.status}: ${$response.errorMsg || "Unkown error"}`)
        }
        const data = await response.json()
        return {id:data.id, error:null, errorMsg:null}
    }catch(error){
        return {error:500, errorMsg:error.message,uid:null}
    }
}

const findDocument = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_SERVER}/findDocumentDatabase/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.errorMsg || "Unknown error"}`)
    }

    const { error, errorMsg, document } = await response.json()
    return { error, errorMsg, document }

  } catch (e) {
    return { error: 500, errorMsg: e.message, document: null }
  }
}


const saveDocument = async({id, token, diff})=>{
    try{
        const response = await fetch(`${API_SERVER}/saveDoc/${id}`,{
            method:"POST",
            headers:{
                "Content-Type": "application/binary",
                "Authorization": `Bearer ${token}`
            },
            body:diff
        })
        if(!response.ok){
            throw new Error(`HTTP${response.status}: ${response.errorMsg || "Unknown error"}`)
        }
        const {error, errorMsg, saved} = await response.json()
        return {error, errorMsg, saved}
    }catch(error){
        return {error:500, errorMsg:error.message, saved:null}
    }
}

const saveDocumentSnapshot=async({token, id, snapshot})=>{
    try{
        const response = await fetch(`${API_SERVER}/saveSnapshot/${id}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/binary",
                "Authorization": `Bearer ${token}`
            },
            body:snapshot
        })
        if(!response.ok){
            throw new Error(`HTTP ${response.status}: ${response.errorMsg || "Unknown error"}`)
        }
        const {error, errorMsg,savedWholeDocument } = await response.json()
        return {error, errorMsg,savedWholeDocument}
    }catch(e){
        return {error:500, errorMsg:error.message, savedWholeDocument:null}
    }
}

const saveDocumentMetaData = async({token, id, ownerName, ownerEmail, ownerId})=>{
    try{
        const response = await fetch (`${API_SERVER}/saveDocumentMetaData/${id}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({ownerName, ownerId, ownerEmail})
        })
        const {error, errorMsg,saveDocumentMetaData} = await response.json()
        if(!response.ok){
            throw new Error(`HTTP ${response.status}: ${response.errorMsg || "Unknown Error"}`)
        }
        return  {error, errorMsg,saveDocumentMetaData}
    }catch(e){
        return {error:500, errorMsg:e.message, saveDocumentMetaData:null}
    }
}

const loadDocument = async({token, id})=>{
    try{
        const response = await fetch(`${API_SERVER}/loadDocument/${id}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        const {error, errorMsg, snapshot, updates,name} = await response.json()
        if(!response.ok){
            throw new Error(`HTTP Status ${response.status}: ${errorMsg || "Unknown error"}`)
        }
        return {error, errorMsg, snapshot,updates,name}
    }catch(e){
        console.log("Error in loading document: ", e.message)
        return {error:500, errorMsg:e.message, snapshot:null,updates:null,name:null}
    }
}

const getColor = async({token})=>{
    try{
        let response = await fetch(`${API_SERVER}/getRandomColor`,{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        const {error, errorMsg, color} = await response.json()
        if(!response.ok){
            throw new Error(`HTTP Status ${response.status}: ${errorMsg|| "Unknown error"}`)
        }
        return {error, errorMsg, color}
    }catch(e){
        console.log("In get color")
        return {error:500, errorMsg:e.message, color:null}
    }
}

const getDocumentMetaData = async({token, uid})=>{
    try{
        const response = await fetch(`${API_SERVER}/checkDocumentsPresentOrNot`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body:JSON.stringify({uid})
        })
        const {error, errorMsg, metaData} = await response.json()
        if(!response.ok) {
            throw new Error(`HTTP Status ${response.status}: ${errorMsg|| "Unknown error"}`)
        }
        return {error, errorMsg, metaData}
    }catch(e){
        console.log("error in getDocumentMetaData",e.message)
        return {error:500, errorMsg:e.message, metaData:null}
    }
}

const saveDocumentName=async({token,id,name})=>{
    try{
        const response = await fetch(`${API_SERVER}/saveDocumentName/${id}/${name}`,{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        if(!response.ok){
            throw new Error(`HTTP Status ${response.status}: ${errorMsg|| "Unknown error"}`)
        }
        const {error, errorMsg, savedDocumentName} = await response.json()
        return {error, errorMsg, savedDocumentName}
    }catch(e){
        console.log("In saveDodumcent Name../.....",e.message)
        return {error:500, errorMsg: e.message, savedDocumentName:null}
    }
}

export const api = {
    getUniqueId,
    saveDocument,
    saveDocumentSnapshot,
    findDocument,
    saveDocumentMetaData,
    loadDocument,
    getColor,
    getDocumentMetaData,
    saveDocumentName
}
