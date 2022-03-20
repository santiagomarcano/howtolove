import { useState } from 'react'
import logo from './logo.svg'
import Game from './components/Game'
import { UserProvider, useUser } from './store/user'
import Login from './components/Login'
import Chat from './components/Chat'

function Main () {
  const [username] = useUser()
  return (
    <>
      {username ? (
        <>
          <Chat />
          <Game />
        </>
      ) : (
        <>
          <Login />
          <div>Please login before</div>
        </>
      )}
    </>
  )
}

function App () {
  return (
    <div className='App'>
      <UserProvider>
        <Main />
      </UserProvider>
    </div>
  )
}

export default App
