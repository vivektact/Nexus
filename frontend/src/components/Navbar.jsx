import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api"; 

const Navbar = () => {
    const { authUser, isLoading } = useAuthUser();
    const { logoutMutation } = useLogout();
    const location = useLocation();

   
    const { data: friendRequests } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getFriendRequests,
        enabled: !!authUser, 
    });

    
    const incomingRequestCount = friendRequests?.incomingReqs?.length || 0;

    const isChatPage = location.pathname?.startsWith("/chat");

    if (isLoading) {
        return (
            <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center justify-center">
                <span className="loading loading-spinner loading-md"></span>
            </nav>
        );
    }

    return (
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between w-full">
                    <Link to="/" className="flex items-center gap-2.5">
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            NexusMeet
                        </span>
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                        {authUser ? (
                            
                            <>
                                <Link to="/notifications">
                                    {/* Add the `indicator` class to the button */}
                                    <button className="btn btn-ghost btn-circle indicator">
                               
                                        {incomingRequestCount > 0 && (
                                            <span className="indicator-item badge badge-secondary badge-xs"></span>
                                        )}
                                        <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                                    </button>
                                </Link>

                                <div className="avatar">
                                    <div className="w-9 rounded-full">
                                        <img
                                            src={authUser?.profilePic || "/default-avatar.png"}
                                            alt="User Avatar"
                                        />
                                    </div>
                                </div>

                                <button
                                    className="btn btn-ghost btn-circle"
                                    onClick={logoutMutation}
                                >
                                    <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                                </button>
                            </>
                        ) : (
                            // Not logged in view
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="btn btn-sm btn-primary">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-sm btn-outline btn-secondary">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;