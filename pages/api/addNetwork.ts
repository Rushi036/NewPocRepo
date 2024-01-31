import axios from "axios";
import { baseURL } from "@/const";

export async function addNetworkData(data: any, id: any, APIHit: any) {
    if (APIHit == "addNew") {
        await axios.post(baseURL + "network_icons", data);
    }
    else if (APIHit == "updateOld") {
        await axios.put(baseURL + "network_icons/" + id, data);
    }
}

export async function deleteNetworkData(id: any) {
    await axios.delete(baseURL + "network_icons/" + id);
}