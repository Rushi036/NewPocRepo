import axios from "axios";
import { finopsServerBaseUrl } from "@/const";
export async function getReportsDashboard() {
    let adid = sessionStorage.getItem("userEmail");
    let role = sessionStorage.getItem("userRole");
    return await axios.post(finopsServerBaseUrl + `/AWSAndAzureDashBordChartsAPI?adid=bhuwan.phuloria%40adityabirla.com&role=${role}`)
}