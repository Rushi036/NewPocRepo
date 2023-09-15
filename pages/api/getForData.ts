import axios from "axios";

const baseURL = "http://localhost:8000/";
export async function getFormData(id: any) {
    return await axios.get(baseURL + "resourse_data?topology_id=" + id)
}

export async function updateFormData(id: any, data:any) {
    return await axios.put(baseURL + "resourse_data/"+id, data)
}

