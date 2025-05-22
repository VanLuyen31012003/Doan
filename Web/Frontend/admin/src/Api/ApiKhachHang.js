import axiosclient from "./AxiosClient";
const ApiKhachHang = {
    getAllKhachHang: () => {
        const url = "/khachhang/getallkhachhang";
        return axiosclient.get(url);
    },
    getKhachHangById: (id) => {
        const url = `/khachhang/getkhachhang/${id}`;
        return axiosclient.get(url);
    },  
    updateKhachHang: (id, data) => {
        const url = `/khachhang/updatekhachhang/${id}`;
        return axiosclient.put(url, data);
    },
    deleteKhachHang: (id) => {
        const url = `/khachhang/deletekhachhang/${id}`;
        return axiosclient.delete(url);
    },
    getDonDatByidKhachHang: (id) => {
        const url = `/dondatxe/getdonbykhachhang/${id}`;
        return axiosclient.get(url);
    },
};
export default ApiKhachHang;