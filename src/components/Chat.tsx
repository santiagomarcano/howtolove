import React, { useState } from 'react'
import { FormEvent } from 'react'
import { Message, socket, useChat, useUser } from '../store/user'

export default function Chat () {
  const messages: Message[] = useChat()
  const [username] = useUser()
  const [text, setText] = useState('')

  const handleNewMessage = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    socket.emit('message', { username, text })
    setText('')
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setText(e.target.value)
  }
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <div>from: {message.username}</div>
          <div>{message.text}</div>
          <hr />
        </div>
      ))}
      <form onSubmit={handleNewMessage}>
        <input
          name='text'
          placeholder='say something'
          value={text}
          onChange={handleChange}
        ></input>
        <button type='submit'>send</button>
      </form>
    </div>
  )
}
