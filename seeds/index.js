const mongoose = require('mongoose');
const Campground = require('../models/campground');
const {cities} = require('./cities');
const {hotelNames} = require('./seedHelpers');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
} 


const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0;i<=23;i++)
    { 
        const camp = new Campground({
            location: `${cities[i].city}, ${cities[i].admin_name}`,
            title: `${hotelNames[i].name}`,
            image: 'https://img.freepik.com/free-photo/night-city-view_1417-1724.jpg?w=1060&t=st=1705142299~exp=1705142899~hmac=05dce89ecea01b01859da98164da46583b560f3bc208afab1a4437dda1bc9f8e',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
