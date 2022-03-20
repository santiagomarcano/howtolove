import * as PIXI from 'pixi.js'
import { AnimatedSprite } from 'pixi.js'
import { useCallback, useEffect, useRef, useState } from 'react'
import playerSprite from '../sprites/playerSheet.png'
// import tmjMap from './maps/map.tmj'
import { Loader } from '@pixi/loaders'
import { CompositeTilemap } from '@pixi/tilemap'
import rawMap from '../../maps/map.json'
import tileSheet from '../sprites/tilemap.png'
import outMap from '../../maps/out.json'
import Map from '../entities/Map'
import Player from '../entities/Player'
import Login from './Login'
import Players from '../entities/Players'

// {
//     "meta": {
//         "image": "atlas.png"
//     },
//     "frames": {
//         "icon_1.png": {
//             "frame": {"x":0, "y":0, "w":32, "h":32},
//             "sourceSize": {"w": 32, "h": 32}
//         },
//         "icon_2.png": {
//             "frame": {"x":32, "y":0, "w":64, "h":64},
//             "sourceSize":{"w": 64, "h": 64}
//         },

//     }
// }

export interface Keys {
  [key: string]: string | boolean
}

export default function Game () {
  const canvas = useRef<HTMLDivElement>(null)
  const [ui, setUI] = useState(false)
  const [username] = useUser()

  console.log('USERNAME', username)

  const bootstrapGame = () => {
    var keys: Keys = {}
    const app = new PIXI.Application({
      width: 600,
      height: 600
      //   resizeTo: window
    })

    const map = new Map({
      game: app,
      level: rawMap,
      tileSheet
    })

    const { player } = new Player(
      {
        x: app.view.width / 2,
        y: app.view.height / 2,
        game: app,
        sprite: {
          source: playerSprite,
          width: 12,
          height: 18
        },
        scale: 5,
        speed: 10,
        map,
        username
      },
      keys
    )

    new Players({
      username,
      game: app,
      map,
      scale: 5,
      sprite: {
        source: playerSprite,
        width: 12,
        height: 18
      }
    })

    if (canvas.current) {
      canvas.current.appendChild(app.view)
      window.addEventListener('keydown', (e: KeyboardEvent) => {
        keys[e.key] = true
      })
      window.addEventListener('keyup', (e: KeyboardEvent) => {
        if (Player.PLAYER_KEYS.includes(e.key)) {
          player.gotoAndStop(1)
        }
        keys[e.key] = false
        keys.last = e.key
      })
      // app.ticker.add(() => {
      //   // follow
      //   m.container.setTransform(
      //     //   -player.x,
      //     -m.container.translateX,
      //     -m.container.translateY,
      //     0,
      //     0,
      //     0,
      //     0,
      //     0,
      //     0,
      //     0
      //     //   m.container.width / 2, //   app.screen.width / 2,
      //     //   m.container.height / 2 //   app.screen.height /
      //   )
      // })
    }
    return () => {
      if (canvas.current) {
        canvas.current.removeChild(app.view)
      }
    }
  }

  function handleUI () {
    setUI(prev => !prev)
  }

  useEffect(() => {
    // setInterval(() => {
    // gun
    //   .get('mark')
    //   .get('live')
    //   .put(Math.random())
    // }, 9)
    if (username) {
      bootstrapGame()
    }
  }, [username])

  return (
    <>
      {ui && (
        <div
          style={{
            // position: 'fixed',
            inset: '0',
            background: 'rgba(255, 0, 0, 0.5)',
            zIndex: 2
          }}
          onClick={() => {
            setUI(false)
          }}
        >
          I'm ui
        </div>
      )}
      <div
        style={{
          // position: 'fixed',
          inset: '0'
        }}
        ref={canvas}
      ></div>
    </>
  )
}
function useUser (): [any] {
  throw new Error('Function not implemented.')
}
