import http from 'http'
import { Server } from 'socket.io'

const httpServer = http.createServer()

const io = new Server(httpServer, {
    cors: { origin: '*' }
})

io.on('connect', (socket) => {
    console.log('a user connected')
    socket.on('message', msg => {
        console.log('message')
        io.emit('message', `${socket.id} said ${msg}`)
    })
})

io.on('error', (err) => {
    console.log(err)
})

const port = process.env.PORT || 8080

httpServer.listen(port, () => console.log(`Http server is listening on http://localhost:${port}`))
