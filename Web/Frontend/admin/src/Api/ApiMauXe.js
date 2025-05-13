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
    }
}
export default ApiMauXe;