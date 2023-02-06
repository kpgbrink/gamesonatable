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

    clientConnection.hostConnection.peerConnection.on('connect', () => {
        console.log('connected to host');
    });

    clientConnection.hostConnection.peerConnection.on('data', data => {
        console.log('data from host', data.toString());
    });

    clientConnection.hostConnection.peerConnection.on('close', () => {
        console.log('connection closed');
        clientConnection.hostConnection = null;
        console.log('clientConnection to host is now', clientConnection);
    });

    // every 2 seconds send test data
    setInterval(() => {
        console.log('trying to send test data');
        if (clientConnection.hostConnection && clientConnection.hostConnection.peerConnection) {
            clientConnection.hostConnection.peerConnection.send('hello from client');
        }
    }, 2000);
    // send tes data to host
    // clientConnection.hostConnection.peerConnection.send('hello from client');
}

// start listening for client connections*
export const startListeningForClientConnections = () => {
    socket.on('signaling-data-to-client', onSignalingData);
}

// stop listening for client connections
export const closeListeningForClientConnections = () => {
    socket.off('signaling-data-to-client', onSignalingData);
}
