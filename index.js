const express = require('express')
const app = express()
const path = require('path')
const port = 8080

const key = "8801f95dd67729b8ce03e0c3341fe04a"
const city = "Tartu"

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            let description = data.weather[0].description
            let city = data.name
            let temp = Math.round(parseFloat(data.main.temp) - 273.15)
            res.render('index', {
                description: description,
                city: city,
                temp: temp
            })
        })
})
    
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})