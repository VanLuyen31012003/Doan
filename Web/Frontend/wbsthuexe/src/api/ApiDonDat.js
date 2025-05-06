import axiosclient from "./Axiosclient";
const ApiDonDat = {
    getdondatbytoken: () => {
        // alert("đây là api dondat by token")
        const url = '/dondatxe/getdonhangbytoken';
        return axiosclient.get(url);
    },
    getallDonDat: () => {
        const url = '/dondat/';
        return axiosclient.get(url);
    },
    addDonDat: (dondat) => {
        const url = '/dondat/';
        return axiosclient.post(url, dondat);
    },
    addDonDatByToken: (dondat) => {
        const url = '/dondatxe/adddon';
        return axiosclient.post(url, dondat);
    },
    getDonDatById: (id) => {
        const url = `/dondatxe/getdon/${id}`;
        return axiosclient.get(url);
    }, 

};
export default ApiDonDat;