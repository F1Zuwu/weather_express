const { error } = require('console')
const express = require('express')
const app = express()
const path = require('path')
const port = 8080

const key = "8801f95dd67729b8ce03e0c3341fe04a"

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const getWeatherDataPromise = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                return response.json()
            })
            .then(data => {
                let description = data.weather[0].description
                let city = data.name
                let temp = Math.round(parseFloat(data.main.temp) - 273.15)
                let result = {
                    description: description,
                    city: city,
                    temp: temp,
                    error: null
                }
                resolve(result)
            })
            .catch(error => {
                reject(error)
            })
    })
}

app.all("/", (req, res) => {
    let city;
    if (req.method === "GET") {
        city = "Tartu"
    }
    if (req.method === "POST") {
        city = req.body.cityname
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    getWeatherDataPromise(url)
    .then(data => {
        res.render('index', data)
    })
    .catch(error => {
        console.log(error)
        res.render('index', {error: 'There was a problem getting data, try again.'})
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})