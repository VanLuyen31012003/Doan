import axiosclient from "./Axiosclient";

const ApiMauXe = {
    getallMauXeb: () => {
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
    },
    getMauXeByloaixe: (loaiXeId) => {
        console.log("hahhhaaa",loaiXeId)
        const url = `/mauxe/getmauxetheoloaixe/${loaiXeId}?page=0&size=10&sort=mauXeId,asc`;
        console.log("đây là ;loai xe id",loaiXeId)
        return axiosclient.get(url)
        
    },
    searchMauxe: (tenMau = '', hangXeId = '', loaiXeId = '', startDate = '', endDate = '', page = 0, size = 100) => {
        let url = `/mauxe/search?`;
    
        // Thêm các tham số vào URL nếu chúng được truyền
        if (tenMau) url += `tenMau=${encodeURIComponent(tenMau)}&`;
        if (hangXeId) url += `hangXeId=${hangXeId}&`;
        if (loaiXeId) url += `loaiXeId=${loaiXeId}&`;
        if (startDate) url += `startDate=${encodeURIComponent(startDate)}&`;
        if (endDate) url += `endDate=${encodeURIComponent(endDate)}&`;
    
        // Thêm các tham số phân trang
        // url += `page=${page}&size=${size}`;
    
        return axiosclient.get(url);
    },
    getallHangXe: () => {
        const url = `/mauxe/getallhangxe`;
        return axiosclient.get(url)
       
    },
    getallLoaiXe: () => {
        const url = '/mauxe/getallloaixe';
        return axiosclient.get(url);
    },
    getrecommendedMauXe: (mauxeid) => {
        let url = `/similar-mauxe?mauXeId=1`;
        if(mauxeid)
            url = `/similar-mauxe?mauXeId=${mauxeid}`;
        return axiosclient.get(url);
    },
    getrecomendbyhistory: (khachhangid) => {
   
           let url = `/vector-based-enhanced?khachHangId=${khachhangid}`;
        return axiosclient.get(url);
    },
    getcountxe: () => {
        const url = '/xe/gettongsoxe';
        return axiosclient.get(url);
    },
    
    
    
}
export default ApiMauXe;
    