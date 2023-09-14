import axios from "axios";

const baseURL = "http://localhost:8000/";
export async function getUserData(id: any) {
  return await axios.get(baseURL+"users?id="+id)
}
