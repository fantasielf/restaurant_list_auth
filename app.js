const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')
const methodOverride = require('method-override')
const flash = require('connect-flash')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')

const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)



app.get('/', (req, res) => {
  Restaurant.find()
    .lean() //清空資料
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

//set router for new page
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

//Set router for creat-new
app.post('/restaurants/', (req, res) => {
  const newRestaurant = req.body
  console.log(req.body)
  return Restaurant.create({
    name: newRestaurant.name,
    category: newRestaurant.category,
    image: newRestaurant.image,
    location: newRestaurant.location,
    phone: newRestaurant.phone,
    google_map: newRestaurant.google_map,
    description: newRestaurant.description,
    rating: newRestaurant.rating
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


//Set router for viewing restaurant detail
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

//Set router for edit page
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

//Set router for edit-save
app.put('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.body) // replace the entire set of data
      return restaurant.save()
    })
    .then(restaurant => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})
//set router for delete function
app.delete('/restaurants/:restaurant_id', (req, res) => {
  console.log(req.params.restaurant_id)
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


app.listen(PORT, () => (
  console.log(`App is running on http://localhost:${PORT}`)
))