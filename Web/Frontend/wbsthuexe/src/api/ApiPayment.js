import axiosclient from "./Axiosclient";

const ApiPayment = {
    paymentVNPAY: (id,totalPrice) => {
        const url = `/payment/api/payment/create?amount=${totalPrice}&orderId=${id}`;
        return axiosclient.get(url);
    }, 
    paymentPAYPAL: (id, totalPrice) => {
        const url = `/payment/paypal?amount=${totalPrice}&orderId=${id}`;
        return axiosclient.post(url);
    },

}
export default ApiPayment;
    