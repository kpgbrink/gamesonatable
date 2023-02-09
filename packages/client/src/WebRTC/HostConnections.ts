import { useEffect } from "react";
import socket from "../SocketConnection";
import { HostPeerConnection } from "./PeerConnection";


export class HostConnections {
    playerConnections: HostPeerConnection[] = [];
}

// create global host connections object
const hostConnections = new HostConnections();

export default hostConnections;

let number = 0;
let hostIntervalId: string | number | NodeJS.Timeout | null | undefined = null;

const onSignalingData = (data: any, clientId: string) => {
    console.log('client data', data);
    const existingConnection = hostConnections.playerConnections.find((connection) => connection.clientId === clientId);
    if (existingConnection) {
        return existingConnection;
    }
    const newConnection = new HostPeerConnection(clientId);
    hostConnections.playerConnections.push(newConnection);


    newConnection.peerConnection.signal(data);

    console.log('hostConnections', hostConnections);


    const onConnect = () => {
        console.log('connected to client');
    }
    newConnection.peerConnection.removeListener('connect', onConnect);
    newConnection.peerConnection.on('connect', onConnect);

    const onData = (data: any) => {
        console.log('data from client', number++, data.toString());
    }
    newConnection.peerConnection.removeListener('data', onData);
    newConnection.peerConnection.on('data', onData);

    const onClose = () => {
        console.log('connection closed');
        hostConnections.playerConnections = hostConnections.playerConnections.filter((connection) => connection.clientId !== clientId);
        console.log('hostConnections', hostConnections);
    };
    newConnection.peerConnection.removeListener('close', onClose);
    newConnection.peerConnection.on('close', onClose);

    // every 5 seconds send test data to all clients
    if (hostIntervalId) {
        clearInterval(hostIntervalId);
    }
    hostIntervalId = setInterval(() => {
        console.log('trying to send test data', hostConnections);
        hostConnections.playerConnections.forEach((connection) => {
            console.log('sending test data to client', connection.clientId, '...')
            if (connection.peerConnection) {
                connection.peerConnection.send('hello from host: ' + countsa++);
            }
        });
    }, 5000);

    return newConnection;
}

export const startListeningForHostConnections = () => {
    socket.on('signaling-data-to-host', onSignalingData);
}

let countsa = 0;
export const closeListeningForClientConnections = () => {
    socket.off('signaling-data-to-host', onSignalingData);
}

// create react custom hook to listen for connections
export const useHostConnections = () => {
    useEffect(() => {
        startListeningForHostConnections();
        return () => {
            closeListeningForClientConnections();
        }
    }, []);
}