import React, { useState } from 'react'
import { useUser, socket } from '../store/user'

export default function Login () {
  const [username, setUsername] = useUser()
  const [value, setValue] = useState('')
  function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    socket.emit('position', {
      username: value,
      x: 0,
      y: 0
    })
    setUsername(value)
    localStorage.setItem('username', value)
  }

  function handleChange (e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function signout () {
    setUsername('')
  }

  return (
    <>
      {username && (
        <>
          <button onClick={signout}>logout</button>
          <p>{username}</p>
        </>
      )}
      <form onSubmit={handleSubmit}>
        <input name='username' onChange={handleChange} />
        <button type='submit'>submit</button>
      </form>
    </>
  )
}
