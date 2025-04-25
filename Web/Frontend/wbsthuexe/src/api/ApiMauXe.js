import axiosclient from "./Axiosclient";

const ApiMauXe = {
    getallMauXe: () => {
        const url = '/mauxe/';
        return axiosclient.get(url);
    },
    getMauXeById: (id) => {
        const url = `/mauxe/${id}`;
        return axiosclient.get(url);
    },
    getMauXeByIdXe: (id) => {
        const url = `/mauxe/mauxetheoxe/${id}`;
        return axiosclient.get(url);
    },
    gettop10MauXe: () => {
        const url = '/mauxe/gettop10mauxe';
        return axiosclient.get(url);
    }
    
    
}
export default ApiMauXe;
    