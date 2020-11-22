const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurants = require('./restaurant.json').results
const db = require('../../config/mongoose')

const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('Seed-mongodb connected!')
  SEED_USER.forEach(user => {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash => User.create({
        name: user.name,
        email: user.email,
        password: hash
      }))
      .then(user => {
        const userId = user.id
        return Promise.all(Array.from({ length: 3 }, (v, i) => {
          Restaurant.create({
            id: restaurants[i].id,
            name: restaurants[i].name,
            name_en: restaurants[i].name_en,
            category: restaurants[i].category,
            image: restaurants[i].image,
            location: restaurants[i].location,
            phone: restaurants[i].phone,
            google_map: restaurants[i].google_map,
            rating: restaurants[i].rating,
            description: restaurants[i].description,
            userId: user._id
          })
        }))
          .then(restaurants.splice(0, 3))
      })
  })
  console.log('done')
})