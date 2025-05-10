import axiosclient from "./Axiosclient";

const ApiPayment = {
    payment: (id,totalPrice) => {
        const url = `/payment/api/payment/create?amount=${totalPrice}&orderId=${id}`;
        return axiosclient.get(url);
    }, 

}
export default ApiPayment;
    