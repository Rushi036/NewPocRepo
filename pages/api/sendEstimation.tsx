import axios from "axios";

const baseURL = "http://localhost:8000/";
export async function sendEstimation(id: any, data: any) {
  await axios.put(
    baseURL + "topology_table_data/" + id,
    data
  );
}

export async function getOldData(id: any) {
  return await axios.get(baseURL + "topology_table_data?topology_id=" + id);
}
