import axiosclient from "./Axiosclient";

const ApiDanhGia = {
    getAllDanhGia: () => {
        const url = '/danhgia/';
        return axiosclient.get(url);
    },
    getDanhGiaById: (id) => {
        const url = `/danhgia/${id}`;
        return axiosclient.get(url);
    },
    addDanhGia: (danhgia) => {
        const url = '/danhgia/';
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
