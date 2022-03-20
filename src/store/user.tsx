import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import Players from '../entities/Players'
import { io } from 'socket.io-client'

// export const db = GUN({
//   peers: ['http://192.168.0.177:4000/gun']
// })

export const socket = io(import.meta.env.VITE_SERVER as any)

export const user = null

const UserContext: any = createContext([])
const ChatContext: any = createContext([])

export interface Message {
  username: string
  text: string
}

export function UserProvider ({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<any>(
    localStorage.getItem('username')
  )
  const [loadedPlayers, setLoadedPlayers] = useState<any>(false)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('[*] Connected Socket')
      socket.on('state', data => {
        Players.activePlayers = data
      })
      socket.on('chat', data => {
        setMessages(data)
      })
    })
  }, [])
  return (
    <UserContext.Provider value={[username, setUsername]}>
      <ChatContext.Provider value={messages}>{children}</ChatContext.Provider>
    </UserContext.Provider>
  )
}

export function useUser (): [any, any] {
  return useContext(UserContext)
}

export function useChat (): Message[] {
  return useContext(ChatContext)
}
