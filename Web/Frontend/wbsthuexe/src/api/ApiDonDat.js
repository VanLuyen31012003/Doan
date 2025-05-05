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
    }

};
export default ApiDonDat;