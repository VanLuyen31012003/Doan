import axiosclient from "./AxiosClient";
const ApiMauXe = {
    getAllMauXe: () => {
        const url = '/mauxe';
        return axiosclient.get(url);
    },
    getMauXeById: (id) => {
        const url = `/mauxe/${id}`;
        return axiosclient.get(url);
    },
    createMauXe: (data) => {
        const url = '/mauxe';
        return axiosclient.post(url, data);
    },
}
export default ApiMauXe;