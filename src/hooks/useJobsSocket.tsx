import React, { createContext, useContext, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, type Frame, type IMessage } from "@stomp/stompjs";

interface JobMessage {
    action: "created" | "updated" | "deleted";
    job: any;
}

interface SocketContextType {
    client: Client | null;
    subscribeToJobs: (callback: (msg: JobMessage) => void) => () => void;
    subscribeToUserJobs: (userId: number, callback: (msg: JobMessage) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
    children: React.ReactNode;
    token: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, token }) => {
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        console.log("[Socket] Inicializando conexión...");
        const socket = new SockJS("http://localhost:8090/api/v1/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket as any,
            connectHeaders: { Authorization: `Bearer ${token}` },
            debug: (str) => console.log("[STOMP DEBUG]", str),
            reconnectDelay: 5000,
        });

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            console.log("[Socket] Desactivando conexión...");
            stompClient.deactivate();
            clientRef.current = null;
        };
    }, [token]);

    const subscribeToJobs = (callback: (msg: JobMessage) => void) => {
        const client = clientRef.current;
        if (!client) {
            console.warn("[Socket] Intento de suscripción sin cliente activo");
            return () => { };
        }

        console.log("[Socket] Suscribiéndose a /topic/jobs ...");
        const subscription = client.subscribe("/topic/jobs", (message: IMessage) => {
            console.log("[Socket] Mensaje recibido en /topic/jobs:", message.body);
            try {
                const parsed: JobMessage = JSON.parse(message.body);
                callback(parsed);
            } catch (e) {
                console.error("[Socket] Error al parsear mensaje:", e);
            }
        });

        return () => subscription.unsubscribe();
    };

    const subscribeToUserJobs = (userId: number, callback: (msg: JobMessage) => void) => {
        const client = clientRef.current;
        if (!client) {
            console.warn("[Socket] Intento de suscripción sin cliente activo");
            return () => { };
        }

        const destination = `/user/${userId}/jobs`;
        console.log(`[Socket] Suscribiéndose a ${destination} ...`);
        const subscription = client.subscribe(destination, (message: IMessage) => {
            console.log(`[Socket] Mensaje recibido en ${destination}:`, message.body);
            try {
                const parsed: JobMessage = JSON.parse(message.body);
                callback(parsed);
            } catch (e) {
                console.error("[Socket] Error al parsear mensaje:", e);
            }
        });

        return () => subscription.unsubscribe();
    };


    return (
        <SocketContext.Provider value={{ client: clientRef.current, subscribeToJobs, subscribeToUserJobs }}>
            {children}
        </SocketContext.Provider>
    );
};


export const useJobsSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error("useJobsSocket debe usarse dentro de un SocketProvider");
    return context;
};
