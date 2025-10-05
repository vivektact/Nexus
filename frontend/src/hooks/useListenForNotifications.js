import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useListenForNotifications = () => {
    const { socket } = useSocketContext();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (socket) {
            // Listen for new friend requests
            socket.on("newFriendRequest", (data) => {
                toast.success(data.message);
                // Invalidate queries to refetch data and update UI
                queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
                queryClient.invalidateQueries({ queryKey: ["users"] });
            });

            // Listen for accepted friend requests
            socket.on("friendRequestAccepted", (data) => {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
                queryClient.invalidateQueries({ queryKey: ["friends"] });
            });

            // Listen for rejected friend requests
            socket.on("friendRequestRejected", (data) => {
                toast.error(data.message);
                // You might not need to invalidate anything here, but you could
                // if you had a component showing "sent requests"
            });

            // Cleanup: remove listeners when component unmounts
            return () => {
                socket.off("newFriendRequest");
                socket.off("friendRequestAccepted");
                socket.off("friendRequestRejected");
            };
        }
    }, [socket, queryClient]);
};

export default useListenForNotifications;