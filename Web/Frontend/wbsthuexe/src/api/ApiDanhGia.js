import axiosclient from "./Axiosclient";

const ApiDanhGia = {
    getAllDanhGia: () => {
        const url = '/danhgia/getalldanhgiabyid/1?page=0&size=100&sort=ngayDanhGia,desc';
        return axiosclient.get(url);
    },
    getDanhGiaById: (id) => {
        const url = `/danhgia/${id}`;
        return axiosclient.get(url);
    },
    addDanhGia: (danhgia) => {
        const url = '/danhgia/create';
        return axiosclient.post(url, danhgia);
    },
    updateDanhGia: (id, danhgia) => {
        const url = `/danhgia/${id}`;
        return axiosclient.put(url, danhgia);
    },
    deleteDanhGia: (id) => {
        const url = `/danhgia/${id}`;
        return axiosclient.delete(url);
    }
};
export default ApiDanhGia;
