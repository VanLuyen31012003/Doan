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
        const url = '/nguoidung';
        return axiosclient.post(url, data);
    },
    updateNguoiDung: (id, data) => {
        const url = `/nguoidung/${id}`;
        return axiosclient.put(url, data);
    },
    deleteNguoiDung: (id) => {
        const url = `/nguoidung/${id}`;
        return axiosclient.delete(url);
    },
}
export default ApiNguoiDung;