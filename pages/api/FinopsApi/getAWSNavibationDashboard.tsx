import axios from "axios";
import { finopsServerBaseUrl } from "@/const";
export async function getAWSNavigationDashboard(gte: any, lte: any) {
  let adid = sessionStorage.getItem("userEmail");
  try {
    return await axios.post(
      finopsServerBaseUrl +
        `/AWSNavigationDashBordChartsAPI?adid=${adid}&gte=${gte}&lte=${lte}`
    );
  } catch (error) {
    console.error("Error in getting Finops Report data", error);
    return { status: "400" };
  }
}
