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
    giaHanDonDat: (id, dondat) => {
        const url = `/dondatxe/giahan/${id}`;
        return axiosclient.post(url, dondat);
    },
    huydondat: (id) => {
        const url = `/dondatxe/updatedontoken/${id}`;
        const data = {
            trangThai: 3 // 3 là trạng thái đã hủy'
        };
        return axiosclient.put(url, data);
    },
    getcountdondat: () => {
        const url = '/dondatxe/gettongdondat';
        return axiosclient.get(url);
    },
};
export default ApiDonDat;