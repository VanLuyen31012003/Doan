import axiosclient from "./AxiosClient";
const ApiDonDat = {
    getAllDonDat: () => {
        const url = '/dondatxe/getalldon';
        return axiosclient.get(url);
    },
    getDonDatById: (id) => {
        const url = `/dondat/${id}`;
        return axiosclient.get(url);
    },
    createDonDat: (data) => {
        const url = '/dondat';
        return axiosclient.post(url, data);
    }
}
export default ApiDonDat;