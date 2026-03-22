import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  days: Number,
  budget: String,
  travelers: Number,
  itinerary: [
    {
      day: String,
      places: [
        {
          name: String,
          details: String
        }
      ]
    }
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);