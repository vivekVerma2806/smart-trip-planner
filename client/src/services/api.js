import axios from "axios";

export const getTripPlan = async (data) => {
  try {
    const res = await axios.post(
      "https://smart-trip-planner-8rdv.onrender.com/plan-trip", 
      data
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};
