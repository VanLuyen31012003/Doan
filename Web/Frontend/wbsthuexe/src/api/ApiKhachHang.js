import axiosclient from "./Axiosclient";

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
    },
    updateInfo: (user) => {
        const url = '/khachhang/updateinfo';
        return axiosclient.put(url,user);
    },

    
};
export default ApiKhachHang;