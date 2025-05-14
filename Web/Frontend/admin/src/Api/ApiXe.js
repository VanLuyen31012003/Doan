import axiosclient from "./AxiosClient";
const ApiXe = {
    getAllXe: () => {
        const url = '/xe/getallxe';
        return axiosclient.get(url);
    },
    getXeById: (id) => {
        const url = `/xe/${id}`;
        return axiosclient.get(url);
    },
    createXe: (data) => {
        const url = '/xe/addxe';
        return axiosclient.post(url, data);
    },
    updateXe: (id, data) => {
        const url = `/xe/updatexe/${id}`;
        return axiosclient.put(url, data);
    },
    deleteXe: (id) => {
        const url = `/xe/deletexe/${id}`;
        return axiosclient.delete(url);
    },
}
export default ApiXe;