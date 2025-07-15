import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
    baseURL: `https://life-drop-server.vercel.app`
});

const useAxiosSecure = () => {

    const { user, userLogOut } = useAuth();
    // console.log(user.accessToken);


    const navigate = useNavigate();
    if (!user) return
    axiosSecure.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${user.accessToken}`
        return config
    }, error => {
        return Promise.reject(error);
    });


    axiosSecure.interceptors.response.use(res => {
        return res;
    }, error => {
        const status = error?.status;
        if (status === 403) {
            navigate('/forbidden');
        } else if (status === 401) {
            userLogOut()
                .then(() => {
                    navigate('/login');
                })
                .catch(err => {
                    console.log('error from response interceptor in axiosSecure', err);
                })
        };
        Promise.reject(error);
    })

    return axiosSecure;
}
export default useAxiosSecure;