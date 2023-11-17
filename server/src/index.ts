import http from 'http'
import { Server, Socket } from 'socket.io'
import { getRoomName } from './utils'
import Logger, { LogLevel } from './logger'

Logger.init(LogLevel.DEBUG)

const DOMAIN = '.'

type User = {
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

const httpServer = http.createServer()

const io = new Server(httpServer, {
    cors: { origin: '*' }
})

const userSockets: Map<string, Socket> = new Map(); // Store connected users

io.on('connect', (socket) => {
    Logger.info('a user connected', DOMAIN)

    socket.on(SocketEvents.SET_USER, (user: User) => {
        userSockets.set(user.email, socket)
    })

    socket.on(SocketEvents.PRIVATE_MESSAGE, (msg: IMessage) => {
        const targetSocket = userSockets.get(msg.receiverId)
        if (targetSocket) {
            targetSocket.emit(SocketEvents.PRIVATE_MESSAGE, {
                message: msg.message,
                timestamp: msg.timestamp,
                from: msg.senderId
            })
        }
    })

    socket.on(SocketEvents.DISCONNECT, () => {
        Logger.info(`User disconnected: ${socket.id}`, DOMAIN)
    })
})

io.on('error', (err) => {
    console.log(err)
})

const port = process.env.PORT || 8080

httpServer.listen(port, () => console.log(`Http server is listening on http://localhost:${port}`))
