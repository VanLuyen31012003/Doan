import axiosclient from "./AxiosClient";
const ApiLoaiXeVaHangXe = {
    getAllHangxe: () => {
        const url = '/xe/getallhangxe';
        return axiosclient.get(url);
    },
    getAllLoaiXe: () => {
        const url = '/xe/getallloaixe';
        return axiosclient.get(url);
    },
    createHangXe: (data) => {
        const url = '/hangxe';
        return axiosclient.post(url, data);
    },
    createLoaiXe: (data) => {
        const url = '/loaixe';
        return axiosclient.post(url, data);
    },
}
export default ApiLoaiXeVaHangXe;