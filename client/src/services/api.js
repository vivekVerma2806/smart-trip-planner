import axios from "axios";

export const getTripPlan = async (data) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/plan-trip", 
      data
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};