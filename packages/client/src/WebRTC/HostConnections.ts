import { useEffect } from "react";
import socket from "../SocketConnection";
import { HostPeerConnection } from "./PeerConnection";


export class HostConnections {
    playerConnections: HostPeerConnection[] = [];
}

// create global host connections object
const hostConnections = new HostConnections();

export default hostConnections;

const onSignalingData = (data: any, clientId: string) => {
    console.log('client data', data);
    const newPlayerConnection = new HostPeerConnection(clientId);
    if (!newPlayerConnection.peerConnection) {
        throw new Error('peer connection is null');
    }
    newPlayerConnection.peerConnection.signal(data);
    // add new player connection to array
    // replace existing player connection if client id already exists
    hostConnections.playerConnections = hostConnections.playerConnections.filter((connection) => connection.clientId !== clientId);
    hostConnections.playerConnections.push(newPlayerConnection);

    newPlayerConnection.peerConnection.on('signal', data => {
        console.log('host signaling data', data);
        socket.emit('signaling-data-to-client', data, clientId);
    });
    console.log('hostConnections', hostConnections);
}

export const startListeningForHostConnections = () => {
    socket.on('signaling-data-to-host', onSignalingData);
}

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