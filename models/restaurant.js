const mongoose = require('mongoose')
const Schema = mongoose.Schema


const typeString = {
  //資料型別是字串，且必填
  type: String,
  require: true
}
const typeStringNR = {
  //資料型別是字串，非必填
  type: String,
  require: false
}
const typeNumber = {
  //資料型別是數字，且必填  
  type: Number,
  require: true
}
const restaurantSchema = new Schema({
  name: typeString,
  name_en: typeStringNR,
  category: typeString,
  image: typeStringNR,
  location: typeString,
  phone: typeStringNR,
  google_map: typeStringNR,
  rating: typeStringNR,
  description: typeString,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    require: true
  }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
