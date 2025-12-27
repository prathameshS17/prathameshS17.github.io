require("dotenv").config()
const app = require("./app")
const http = require("http")
const initWebSocket = require("./websocket")
const connectDB = require("./db/db.js")
const { ulid } = require("ulid");
const {auth}  = require("./firebase-admin.js")
const { error } = require("console")

const server = http.createServer(app)
initWebSocket(server)
const PORT = process.env.PORT || 8080


async function verifyFirebaseToken (req,res,next){
    const authHeader = req.headers.authorization || ""
    const match = authHeader.match(/^Bearer (.+)$/)
    if (!match) return res.status(401).send("Missing token")
    try {
        const decodedToken = await auth.verifyIdToken(match[1]);
        req.user = decodedToken; // attach user info
        next();
    } catch (err) {
            console.error("Token verification failed", err);
            return res.status(401).send("Invalid token");
    }
}

let db

(async()=>{
    db = await connectDB()
})()

app.get("/users",async(req,res)=>{
    try{
        const user  = await db.collection("user").find().toArray()
        console.log("users are.//..../..",user)
        res.status(200).json({user:user})
    }catch(error){
        console.log("In users")
        res.status(502).json({error:error})
    }
})

app.get("/getID",verifyFirebaseToken,(req,res)=>{
    try{
        const id = ulid()
        res.status(200).json({error:null, errorMsg:null, id})
    }catch(error){
        console.log("In getID")
        res.status(500).json({error:500, errorMsg:error.message, id:null})
    }
})

app.get("/findDocumentDatabase/:id",verifyFirebaseToken,async(req,res)=>{
    try{
        const {id} = req.params
        const document = await db.collection("documents").findOne({docId:id})
        if(!document){
            throw new Error("No document found")
        }
        // console.log("document is../...",document)
        res.status(200).json({error:null,errorMsg:null, document})
    }catch(err){
        console.log("In findDocument",err.message)
        res.status(500).json({error:500, errorMsg: err.message, document:null})
    }
})

app.post("/saveDoc/:id",verifyFirebaseToken,(req,res)=>{
    try{
        const chunks = []
        const {id} = req.params
        req.on("data", chunk => chunks.push(chunk))
        req.on("end", async () => {
            const update = Buffer.concat(chunks) // now you have the update
            const saved = await db.collection("documents").updateOne(
                { docId: id },
                { 
                    $push: { updates: update }
                },
                { upsert: true }
            )
            // console.log("saved is../...",saved)
            res.status(200).json({error:null, errorMsg:null, saved})
        })
    }catch(err){
        console.log("In saveDoc")
        res.status(500).json({error:500, errorMsg:err.message, saved:null})
    }
})

app.post("/saveSnapshot/:id",verifyFirebaseToken,(req,res)=>{
    try{
        const chunks = [];
        const id = req.params.id;

        req.on("data", chunk => chunks.push(chunk));
        req.on("end", async () => {
            const snapshot = Buffer.concat(chunks);

            const saved = await db.collection("documents").updateOne(
                { docId: id },
                {
                    $set: { latestSnapshot: { ts: Date.now(), data: snapshot } },
                    $setOnInsert: { updates: [] }
                },
                { upsert: true }
            )
            // console.log("saved is../...",saved)
            res.status(200).json({error:null, errorMsg:null, savedWholeDocument:saved})
        })
    }catch(err){
        console.log("In saveSnapshot")
        res.status(500).json({error:500, errorMsg:err.message, savedWholeDocument:null})
    }
})

app.get("/loadDocument/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await db.collection("documents").findOne({ docId: id });

    if (!doc) {
        throw new Error("Document not found")
    }

    res.status(200).json({
        snapshot: doc.latestSnapshot ? doc.latestSnapshot.data.toString("base64") : null,
        updates: doc.updates.length?(doc.updates).map(u => u.toString("base64")):null,
        name: doc.documentName,
        error:null,
        errorMsg:null
    });
  } catch (err) {
    console.log("Error in loadDocumet and it is:",err.message)
    res.status(500).json({ error:500 ,errorMsg:err.message, snapshot:null, updates:null,name:null });
  }
});

app.post("/saveDocumentMetaData/:id",verifyFirebaseToken,async(req,res)=>{
    try{
        const {id} = req.params
        const {ownerName, ownerEmail, ownerId} = req.body
        console.log(" ownerName, ownerEmail, ownerId is../...",ownerName, ownerEmail, ownerId)
        const saveMetaData = await db.collection("document-meta-data").updateOne(
            {ownerId:ownerId},
            {
                $set:{
                    ownerName, ownerEmail, ownerId, sharedWithMe:[]
                },
                $push:{
                    ownedDocument:id,
                }
            },
            {upsert:true}
        )
        // console.log("saveMetaData is../..",saveMetaData)
        res.status(200).json({error:null, errorMsg:null, metaSaved:true})
    }catch(e){
        console.log("Error in saveDocumentMetaData is.../..",e.message)
        res.status(500).json({error:500, errorMsg:e.message,metaSaved:false})
    }
})

const randomColorGenerator=()=>{
    let randomNumber = Math.floor(Math.random() * 16777215);
    console.log("randomNumber is../....",randomNumber)
    // Convert the number to a hexadecimal string
    let hexColor = randomNumber.toString(16);
    console.log("hexColor is../....",hexColor)
    // Pad the hexadecimal string with leading zeros if necessary to ensure 6 characters
    let paddedHexColor = hexColor.padStart(6, '0');
    console.log("paddedHexColor is../....",paddedHexColor)
    return paddedHexColor
}

app.get("/getRandomColor",verifyFirebaseToken,(req,res)=>{
    try{
        let color = randomColorGenerator()
        res.status(200).json({error:null, errorMsg:null, color})    
    }catch(e){
        res.status(500).json({error:500, errorMsg:e.message, color:null})
    }
})

app.post("/checkDocumentsPresentOrNot",verifyFirebaseToken,async(req,res)=>{
    try{
        const {uid} = req.body
        const result  = await db.collection("document-meta-data").aggregate([
            {$match:{ownerId:uid}},
        ]).toArray()
        console.log("result is../...",result[0])
        res.status(200).json({error:null, errorMsg:null,metaData:result[0]})
    }catch(e){
        console.log("error is../..",e.message)
        res.status(500).json({error:500, errorMsg:e.message,metaData:null})
    }
})

app.get("/saveDocumentName/:id/:name",async(req,res)=>{
    try{
        const {id,name} = req.params
        console.log("Name and id is../...",name,id)
        const result = await db.collection("documents").updateOne(
            {docId:id},
            {
                $set:{documentName:name},
                $setOnInsert:{docId:id,updates:[]}
            },
            {upsert:true}
        )
        console.log("Result is../..",result)
        res.status(200).json({error:null, errorMsg:null, savedDocumentName:result})
    }catch(e){
        console.log("Error in saveDocumentName../....",e.message)
        res.status(500).json({error:500, errorMsg:e.message, savedDocumentName:null})
    }
})  

app.get("/",(req, res)=>{
    res.status(200).send("<h1>Hello from the server</h1>")
})

server.listen(PORT, ()=>{
    console.log(`Server running on port.............. ${PORT}`) 
})

