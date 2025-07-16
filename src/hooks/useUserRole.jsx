import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {

    const { user, loading: AuthLoading } = useAuth();
    const shouldFetch = !AuthLoading && !!user?.email;
    const axiosSecure = useAxiosSecure();

    const { data: role = "donor", isLoading: roleLoading, refetch } = useQuery({
        enabled: shouldFetch,
        queryKey: ['userRole', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/${user?.email}/role`)
            return res.data?.role
        },
        staleTime: 0,
        refetchOnWindowFocus: true
    })

    // console.log(role);


    return { role, role_loading: AuthLoading || roleLoading, refetch }
};

export default useUserRole;