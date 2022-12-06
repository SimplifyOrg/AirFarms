import { AuthProvider } from "./AuthProvider"

function useNotification() {

    function sendNotification(sender, receiver, type, data) {
        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        const body = {
            sender: sender,
            receiver: receiver,
            notification_type: type,
            data: data
        }

        authProvider.authPost(`/notification/data/handle/`, body, config, false)
        .then(res =>{
            console.log(res);
        })
        .catch(error => {
            console.log(error);
        })
    }

    return {sendNotification}
}

export default useNotification