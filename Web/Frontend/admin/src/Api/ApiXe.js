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
    getXeRenting: (startDate = null, endDate = null) => {
        // Tạo đối tượng URL
        const url = new URL('/xe/getxethue', window.location.origin);
        
        // Thêm các tham số nếu có
        if (startDate) {
            // Chuyển đổi sang định dạng ISO
            const formattedStart = new Date(startDate).toISOString();
            url.searchParams.append('startDate', formattedStart);
        }
        
        if (endDate) {
            // Chuyển đổi sang định dạng ISO
            const formattedEnd = new Date(endDate).toISOString();
            url.searchParams.append('endDate', formattedEnd);
        }
        
        return axiosclient.get(url.pathname + url.search);
    }
}
export default ApiXe;