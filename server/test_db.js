import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function checkTrip() {
  await mongoose.connect(process.env.MONGO_URI);
  const tripSchema = new mongoose.Schema({}, { strict: false });
  const Trip = mongoose.model('Trip', tripSchema);
  
  const tripId = '69bfd222c5ac8682bd4d0e85';
  const trip = await Trip.findById(tripId);
  
  if (!trip) {
    console.log("TRIP NOT FOUND IN DB");
  } else {
    console.log("TRIP FOUND. ITINERARY DAY 1, PLACE 1:");
    console.log(JSON.stringify(trip.itinerary[0].places[0], null, 2));
    console.log("VOTES ARRAY LENGTH:", trip.itinerary[0].places[0].votes?.length || 0);
  }
  
  await mongoose.disconnect();
}

checkTrip();
