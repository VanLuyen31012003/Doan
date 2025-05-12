export const KEY_TOKEN = "accessToken";
export const setToken = (token) => {
    localStorage.setItem(KEY_TOKEN, token);
}
export const getToken = () => {
    return localStorage.getItem(KEY_TOKEN);
}
export const removeToken = () => {
    localStorage.removeItem(KEY_TOKEN);
}
export const isAuthenticated = () => {
    const token = getToken();
    if (token) {
        return true;
    }
    return false;
}