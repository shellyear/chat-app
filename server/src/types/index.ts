type IUser = {
    id: string
    email: string
    name: string
}

type IMessage = {
    senderId: string,
    receiverId: string,
    message: string,
    timestamp: number
}

enum SocketEvents {
    PRIVATE_MESSAGE = 'private_message',
    SET_USER = 'set_user',
    DISCONNECT = 'disconnect'
}