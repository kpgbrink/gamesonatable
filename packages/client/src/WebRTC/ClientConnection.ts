import socket from "../SocketConnection";
import { ClientPeerConnection } from "./PeerConnection";

// a client that will be connected to the host user
export class ClientConnection {
    hostConnection: ClientPeerConnection | null = null;
}

// create global client connection object
const clientConnection = new ClientConnection();

export default clientConnection;

export const onSignalingData = (data: any) => {
    console.log('client data', data);
    console.log('clientConnection to host is now', clientConnection)
    if (!clientConnection.hostConnection) {
        clientConnection.hostConnection = new ClientPeerConnection();
    }
    if (!clientConnection.hostConnection.peerConnection) {
        throw new Error('peer connection is null');
    }
    clientConnection.hostConnection.peerConnection.signal(data);
    console.log('clientConnection to host is now', clientConnection);
}

// start listening for client connections*
export const startListeningForClientConnections = () => {
    socket.on('signaling-data-to-client', onSignalingData);
}

// stop listening for client connections
export const closeListeningForClientConnections = () => {
    socket.off('signaling-data-to-client', onSignalingData);
}
