import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { toast } from "react-hot-toast";

const useLogout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear cached user data
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // Show success toast
      toast.success("Logged out successfully!");
    },
    onError: (err) => {
      // Handle error case
      toast.error(err.message || "Failed to logout");
    },
  });

  return { logoutMutation, isPending, error };
};

export default useLogout;
