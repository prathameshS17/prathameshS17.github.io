const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
const port = process.env.PORT || 8080;

const connectDB = require('./db.js');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/getWeatherData/:location',async(req,res)=>{
    try{
        const {location} = req.params
        let loc = location.split(',') 
        fieldsString = "temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,humidity,pressureSeaLevel,uvIndex,weatherCode,precipitationProbability,precipitationType,sunriseTime,sunsetTime,visibility,moonPhase,cloudCover"
        let result = await fetch(`https://api.tomorrow.io/v4/timelines?location=${loc[0]},${loc[1]}&fields=${fieldsString}&timesteps=1d&units=imperial&timezone=America/Los_Angeles&apikey=XXTh8upbfipnNPN969YcW9xM6ABSBKcm`)
        let data = await result.json()
        if(data && 'data' in data){
            res.status(200).json({error:0,errorMsg:'',result:data.data.timelines}) 
            return
        }
        throw new Error('Limit reached');
    }catch(e){
        console.log('Error i getting weather data',e.message)
        res.status(502).json({ error:-1,errorMsg: e.message || 'An unexpected error occurred',result:[] });
    }
})

app.get('/getHourlyData/:location',async(req,res)=>{
    try{
        const {location} = req.params
        let loc = location.split(',') 
        fieldsString = "temperature,windSpeed,windDirection,humidity,pressureSeaLevel"
        let result = await fetch(`https://api.tomorrow.io/v4/timelines?location=${loc[0]},${loc[1]}&fields=${fieldsString}&timesteps=1h&units=imperial&timezone=America/Los_Angeles&apikey=XXTh8upbfipnNPN969YcW9xM6ABSBKcm`)
        let data = await result.json()
        if(data && 'data' in data){
            res.status(200).json({error:0,errorMsg:'',result:data.data.timelines})
            return  
        }
        throw new Error('Limit reached');
    }catch(e){
        console.log('Error i getting hourly data',e)
        res.status(502).json({ error:-1,errorMsg: e.message || 'An unexpected error occurred',result:[] });
    }
})

app.get('/addFav/:address/:userLocation',async(req,res)=>{
    try{
        const {address,userLocation} = req.params
        city={address,userLocation}
        const db = await connectDB();
        const favCollection = db.collection('tomorrow');

        let result= await favCollection.updateOne(
            {address:address},
            {
                $set:city
            },
            {upsert:true}
        )
        res.status(200).json({error:0,errorMsg:'',result:result}) 
    }catch(e){
        console.log('Error in addding data',e)
        res.status(502).json({ error: 'Bad Gateway' });
    }
})

app.get('/deleteFav/:address',async(req,res)=>{
    try{
        const {address} = req.params
        const db = await connectDB();
        const favCollection = db.collection('tomorrow');
        let result = await favCollection.deleteOne({
            address:address
        })
        let list = await favCollection.find().toArray()
        res.status(200).json({error:0,errorMsg:'',result:list})
    }catch(e){
        console.log('Error in deleting data',e)
        res.status(500).json({ error: 'Bad Gateway' });
    }
})

app.get('/getFavList',async(req,res)=>{
    try{
        const db = await connectDB();
        const favCollection = db.collection('tomorrow');
        let data = await favCollection.find().toArray()
        // if (!data.length) {
        //     res.status(502).json({error:1,errorMsg:'Data not found',result:[]})
        //     return false
        // }
        res.status(200).json({error:0,errorMsg:'',list:data})
    }catch(e){
        console.log('Error in getting data',e)
        res.status(502).json({ error: 'Bad Gateway' });
    }
})

app.get('/getPlaces/:cityName',async(req,res)=>{
    try{
        const {cityName} = req.params
        let response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${cityName}&types=(cities)&key=AIzaSyAfXfzSM6swtTr1RezWnbV-8pqya8FFxEI`)
        const data = await response.json();
        let cityList=[]
        if(data){
            cityList = data.predictions.map((ele)=>{
                return {
                    city: ele.terms[0].value,
                    state:ele.terms[1].value,
                    combined:`${ ele.terms[0].value}, ${ele.terms[1].value}`
                }
            })
        }
        console.log('Data is../...',cityList)
        res.status(200).json({error:0,errorMsg:'',city:cityList})
    }catch(e){
        console.log('Error in getPlaces',e)
        res.status(502).json({ error: 'Bad Gateway' });   
    }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});