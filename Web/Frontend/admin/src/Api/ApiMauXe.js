import axiosclient from "./AxiosClient";
const ApiMauXe = {
    getAllMauXe: () => {
        const url = '/mauxe';
        return axiosclient.get(url);
    },
    getMauXeById: (id) => {
        const url = `/mauxe/getmauxe/${id}`;
        return axiosclient.get(url);
    },
    updateMauXe: (id, data) => {
        const url = `/mauxe/updatemauxe/${id}`;
        return axiosclient.put(url, data,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    createMauXe: (data) => {
        const url = '/mauxe/addnewmauxe';
        return axiosclient.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    deleteMauXe: (id) => {
        const url = `/mauxe/deletemauxe/${id}`;
        return axiosclient.delete(url);
    },
    updatethongtinkithuat: (id, data) => {
        const url = `/mauxe/updatethongtinkythuat/${id}`;
        return axiosclient.put(url, data, {
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // }
        });
    },
    getdanhgiabyMauXe: (id) => {
        const url = `/danhgia/getalldanhgiabyid/{?page=0&size=10&sort=ngayDanhGia,desc`;
        return axiosclient.get(url);
    },
    getAllDanhGiaByMauXeId: (mauXeId, page = 0, size = 10, sort = 'ngayDanhGia,desc') => {
        const url = `/danhgia/getalldanhgiabyid/${mauXeId}?page=${page}&size=${size}&sort=${sort}`;
        return axiosclient.get(url);
    },
    deleteDanhGia: (id) => {
        const url = `/danhgia/delete/${id}`;
        return axiosclient.delete(url);
    }
    
    
    
    
}
export default ApiMauXe;