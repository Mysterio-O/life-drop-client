import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserStatus = () => {

    const { user, loading: AuthLoading } = useAuth();
    const shouldFetch = !AuthLoading && !!user?.email;
    const axiosSecure = useAxiosSecure();

    const { data: status = "active", isLoading: roleLoading, refetch } = useQuery({
        enabled: shouldFetch,
        queryKey: ['userStatus', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/${user?.email}/status`)
            return res.data?.status || 'active'
        },
        staleTime: 0,
        refetchOnWindowFocus: true
    })

    console.log(status);


    return { status, status_loading: AuthLoading || roleLoading, refetch }
};

export default useUserStatus;