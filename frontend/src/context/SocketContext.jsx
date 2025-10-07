import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import useAuthUser from "../hooks/useAuthUser";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { authUser } = useAuthUser();

    useEffect(() => {
        if (authUser) {
            const newSocket = io("https://nexus-backend-bmt3.onrender.com", { // Your backend URL
                query: {
                    userId: authUser._id,
                },
            });

            setSocket(newSocket);

            // Cleanup function to close the socket when component unmounts
            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
