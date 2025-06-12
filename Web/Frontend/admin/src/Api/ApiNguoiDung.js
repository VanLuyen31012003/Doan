import axiosclient from "./AxiosClient";
const ApiNguoiDung = {
    login:(user) => {
        const url = '/auth/login';
        return axiosclient.post(url,user);
    },
    getAllNguoiDung: () => {
        const url = '/nguoidung/getallnguoidung';
        return axiosclient.get(url);
    },
    getNguoiDungById: (id) => {
        const url = `/nguoidung/${id}`;
        return axiosclient.get(url);
    },
    createNguoiDung: (data) => {
        const url = '/nguoidung/addnguoidung';
        return axiosclient.post(url, data);
    },
    updateNguoiDung: (email, data) => {
        const url = `/nguoidung/updatenguoidung/${email}`;
        return axiosclient.put(url, data);
    },
    deleteNguoiDung: (id) => {
        const url = `/nguoidung/deletenguoidung/${id}`;
        return axiosclient.delete(url);
    },
    getalldondatbyemailnguoidung: (email) => {
        const url = `/dondatxe/getalldonbynguoidung/${email}`;
        return axiosclient.get(url);
    },
}
export default ApiNguoiDung;