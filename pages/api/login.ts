import axios from "axios";
// import { useEffect } from "react";

const baseURL = "http://localhost:8000/";
export async function login(user: any, pwd: any) {
  return await axios.get(baseURL+"users?email="+user+"&password="+pwd)
}
