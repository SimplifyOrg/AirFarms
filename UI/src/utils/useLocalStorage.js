function useLocalStorage() {

    function setLocalStorage(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // catch possible errors:
            // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
        }
    }
      
    function getLocalStorage(key, value) {
        try {
            const data = window.localStorage.getItem(key);
            return data ? JSON.parse(data) : value;
        } catch (e) {
            // if error, return initial value
            return value;
        }
    }

    return {setLocalStorage, getLocalStorage}
}

export default useLocalStorage