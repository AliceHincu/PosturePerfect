import axios from "./axios";

// Get Posture Scores by token
export const getPostureScoresByToken = async (token: string) => {
  try {
    const response = await axios.get(`/postureScores/${token}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("An error occurred while fetching posture scores:", error);
  }
};

// Get Posture Scores by token
export const getPostureScoresByTokenAndDate = async (token: string, date: any) => {
  try {
    const response = await axios.get(`/postureScores/${token}/${date}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("An error occurred while fetching posture scores by date:", error);
  }
};
