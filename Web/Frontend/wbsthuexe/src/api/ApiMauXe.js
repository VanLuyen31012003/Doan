import axiosclient from "./Axiosclient";

const ApiMauXe = {
    getallMauXe: () => {
        const url = '/mauxe/';
        return axiosclient.get(url);
    },
    getMauXeById: (id) => {
        const url = `/mauxe/getmauxe/${id}`;
        return axiosclient.get(url);
    },
    getMauXeByIdXe: (id) => {
        const url = `/mauxe/mauxetheoxe/${id}`;
        return axiosclient.get(url);
    },
    gettop10MauXe: (mauxeid) => {
         
            let url = `/mauxe/gettop10mauxe`;
        if(mauxeid)
            url = `/mauxe/gettop10mauxe?loaiXeId=${mauxeid}`;
       
        return axiosclient.get(url);
    }
    
    
}
export default ApiMauXe;
    