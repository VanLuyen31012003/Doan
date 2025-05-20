import axiosclient from "./AxiosClient";
const ApiKhachHang = {
    getinfo:() => {
        const url = '/khachhang/getmyinfo';
        return axiosclient.get(url);
    },
    register: (user) => {
        const url = '/khachhang/registerkhachhang';
        return axiosclient.post(url,user);
    },
    login:(user) => {
        const url = '/auth/loginbykhachhang';
        return axiosclient.post(url,user);
    }
};
export default ApiKhachHang;