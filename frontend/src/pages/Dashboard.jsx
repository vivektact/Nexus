import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getRecommendedUsers,
    getUserFriends,
    sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router-dom";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, BellRingIcon } from "lucide-react";
import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const Dashboard = () => {
    const queryClient = useQueryClient();

    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends,
    });

    const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: getRecommendedUsers,
    });

    const { mutate: sendRequestMutation, isPending: isSendingRequest } = useMutation({
        mutationFn: sendFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto space-y-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
                    <Link to="/notifications" className="btn btn-outline btn-sm">
                        <UsersIcon className="mr-2 size-4" />
                        Friend Requests
                    </Link>
                </div>

                {loadingFriends ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : friends.length === 0 ? (
                    <NoFriendsFound />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {friends.map((friend) => (
                            <FriendCard key={friend._id} friend={friend} />
                        ))}
                    </div>
                )}

                <section>
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                        <p className="opacity-70">Discover perfect language exchange partners based on your profile</p>
                    </div>

                    {loadingUsers ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedUsers.map((user) => (
                                <div key={user._id} className="card bg-base-200 hover:shadow-lg transition-all duration-300">
                                    <div className="card-body p-5 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar size-16 rounded-full">
                                                <img src={user.profilePic} alt={user.fullname} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{user.fullname}</h3>
                                                {user.location && (
                                                    <div className="flex items-center text-xs opacity-70 mt-1">
                                                        <MapPinIcon className="size-3 mr-1" />
                                                        {user.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="badge badge-secondary">
                                                {getLanguageFlag(user.nativeLanguage)}
                                                Native: {capitialize(user.nativeLanguage)}
                                            </span>
                                            <span className="badge badge-outline">
                                                {getLanguageFlag(user.desiredLanguage)}
                                                Learning: {capitialize(user.desiredLanguage)}
                                            </span>
                                        </div>

                                        {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                                        <div className="card-actions justify-end mt-2">
                                            {user.friendRequestStatus === 'sent' && (
                                                <button className="btn btn-disabled w-full">
                                                    <CheckCircleIcon className="size-4 mr-2" />
                                                    Request Sent
                                                </button>
                                            )}
                                            {user.friendRequestStatus === 'received' && (
                                                <Link to="/notifications" className="btn btn-secondary w-full">
                                                    <BellRingIcon className="size-4 mr-2" />
                                                    Invitation Received
                                                </Link>
                                            )}
                                            {user.friendRequestStatus === 'none' && (
                                                <button
                                                    className="btn btn-primary w-full"
                                                    onClick={() => sendRequestMutation(user._id)}
                                                    disabled={isSendingRequest}
                                                >
                                                    <UserPlusIcon className="size-4 mr-2" />
                                                    Send Friend Request
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;