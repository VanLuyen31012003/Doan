import axiosclient from "./AxiosClient";
const ApiDonDat = {
    getAllDonDat: () => {
        const url = '/dondatxe/getalldon';
        return axiosclient.get(url);
    },
    getDonDatById: (id) => {
        const url = `/dondatxe/getdon/${id}`;
                //  const url = `/dondatxe/getdon/23`;

        return axiosclient.get(url);
    },
    createDonDat: (data) => {
        const url = '/dondat';
        return axiosclient.post(url, data);
    },
    updateDonDat: (id, data) => {
        const url = `/dondatxe/updatedon/${id}`;
        return axiosclient.put(url, data);
    },
    getalldondatbyidxe: (id) => {
        const url = `/dondatxe/getdonbyidxe/${id}`;
        return axiosclient.get(url);
    },
    giaHanDonDat: (id, dondat) => {
        const url = `/dondatxe/giahan/${id}`;
        return axiosclient.post(url, dondat);
    },
}
export default ApiDonDat;