import axios from "axios";
import  {baseURL}  from "@/const";
// const baseURL = "http://localhost:8000/";
export async function getIcons() {
  return await axios.get(baseURL+"network_icons")
}

export async function getIconsId(id:any) {
  return await axios.get(baseURL+"network_icons?id="+id)
}
