import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { acceptFriendRequest, getFriendRequests, rejectFriendRequest } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, XCircleIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
    const queryClient = useQueryClient();

    const { data: friendRequests, isLoading } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getFriendRequests,
    });

    const { mutate: acceptRequestMutation, isPending: isAccepting } = useMutation({
        mutationFn: acceptFriendRequest,
        onSuccess: () => {
            toast.success("Friend request accepted!");
            queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
            queryClient.invalidateQueries({ queryKey: ["friends"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to accept request.");
        },
    });

    const { mutate: rejectRequestMutation, isPending: isRejecting } = useMutation({
        mutationFn: rejectFriendRequest,
        onSuccess: () => {
            toast.success("Friend request rejected.");
            queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to reject request.");
        },
    });

    const incomingRequests = friendRequests?.incomingReqs || [];
    const acceptedRequests = friendRequests?.acceptedReqs || [];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-4xl space-y-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <>
                        {incomingRequests.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <UserCheckIcon className="h-5 w-5 text-primary" />
                                    Friend Requests
                                    <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                                </h2>

                                <div className="space-y-3">
                                    {incomingRequests.map((request) => (
                                        <div
                                            key={request._id}
                                            className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="card-body p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                                            <img src={request.sender.profilePic} alt={request.sender.fullname} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold">{request.sender.fullname}</h3>
                                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                                <span className="badge badge-secondary badge-sm">
                                                                    Native: {request.sender.nativeLanguage}
                                                                </span>
                                                                <span className="badge badge-outline badge-sm">
                                                                    Learning: {request.sender.desiredLanguage}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                      <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => acceptRequestMutation(request._id)}
                                                            disabled={isAccepting || isRejecting}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            className="btn btn-outline btn-error btn-sm"
                                                            onClick={() => rejectRequestMutation(request._id)}
                                                            disabled={isAccepting || isRejecting}
                                                        >
                                                            <XCircleIcon className="h-4 w-4" />
                                                            Reject
                                                        </button>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {acceptedRequests.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <BellIcon className="h-5 w-5 text-success" />
                                    New Connections
                                </h2>

                                <div className="space-y-3">
                                    {acceptedRequests.map((notification) => (
                                        <div key={notification._id} className="card bg-base-200 shadow-sm">
                                            <div className="card-body p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="avatar mt-1 size-10 rounded-full">
                                                        <img
                                                            src={notification.recipient.profilePic}
                                                            alt={notification.recipient.fullname}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold">{notification.recipient.fullname}</h3>
                                                        <p className="text-sm my-1">
                                                            {notification.recipient.fullname} accepted your friend request
                                                        </p>
                                                        <p className="text-xs flex items-center opacity-70">
                                                            <ClockIcon className="h-3 w-3 mr-1" />
                                                            Recently
                                                        </p>
                                                    </div>
                                                    <div className="badge badge-success">
                                                        <MessageSquareIcon className="h-3 w-3 mr-1" />
                                                        New Friend
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
                            <NoNotificationsFound />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
export default NotificationsPage;
