import { Socket as SocketIosocket } from 'socket.io'
import { UserDocument } from './user.interface'

export interface Socket extends SocketIosocket {
  user? : UserDocument
}