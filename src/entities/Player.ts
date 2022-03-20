import * as PIXI from "pixi.js";
import type { Keys } from "../components/Game";
import Map from "./Map";
import { socket, user } from "../store/user";
interface Sprite {
  source: string;
  width: number;
  height: number;
}

interface Options {
  x: number;
  y: number;
  scale: number;
  speed: number;
  map: Map;
  username: string;
  game: PIXI.Application;
  sprite: Sprite;
}

interface Animations {
  walkDown: PIXI.Texture[];
  walkUp: PIXI.Texture[];
  walkLeft: PIXI.Texture[];
  walkRight: PIXI.Texture[];
  standDown: PIXI.Texture[];
}

export default class Player {
  private game: PIXI.Application;
  private animations!: Animations;
  private sshet: PIXI.BaseTexture;
  private sprite: Sprite;
  private scale: number;
  private speed: number;
  private username: string;
  public x: number;
  public y: number;
  public map: Map;
  private keys: Keys;
  private facing: string;

  static PLAYER_KEYS = ["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"];
  static players = {};
  public player!: PIXI.AnimatedSprite;
  public playersCache: any = {};

  constructor(
    { x, y, game, sprite, scale, speed, map, username }: Options,
    keys: Keys
  ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.speed = speed;
    this.sprite = sprite;
    this.map = map;
    this.username = username;
    this.sshet = new PIXI.BaseTexture(sprite.source);
    this.sshet.scaleMode = 0; // NEAREST
    this.setAnimations();
    this.keys = keys;
    this.facing = "down";
    this.game.ticker.add(this.update.bind(this));
    this.draw();
  }

  setAnimations(): void {
    this.animations = {
      standDown: [
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            1 * this.sprite.width,
            0,
            this.sprite.width,
            this.sprite.height
          )
        ),
      ],
      walkDown: [
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(0, 0, this.sprite.width, this.sprite.height)
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            1 * this.sprite.width,
            0,
            this.sprite.width,
            this.sprite.height
          )
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            2 * this.sprite.width,
            0,
            this.sprite.width,
            this.sprite.height
          )
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            3 * this.sprite.width,
            0,
            this.sprite.width,
            this.sprite.height
          )
        ),
      ],
      walkUp: [
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            0,
            this.sprite.height * 3,
            this.sprite.width,
            this.sprite.height
          )
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            1 * this.sprite.width,
            this.sprite.height * 3,
            this.sprite.width,
            this.sprite.height
          )
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            2 * this.sprite.width,
            this.sprite.height * 3,
            this.sprite.width,
            this.sprite.height
          )
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            3 * this.sprite.width,
            this.sprite.height * 3,
            this.sprite.width,
            this.sprite.height
          )
        ),
      ],
      walkLeft: [
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            0,
            this.sprite.height,
            this.sprite.width,
            this.sprite.height
          )
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            1 * this.sprite.width,
            this.sprite.height,
            this.sprite.width,
            this.sprite.height
          )
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            2 * this.sprite.width,
            this.sprite.height,
            this.sprite.width,
            this.sprite.height
          )
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            3 * this.sprite.width,
            this.sprite.height,
            this.sprite.width,
            this.sprite.height
          )
        ),
      ],
      walkRight: [
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            0,
            this.sprite.height * 2,
            this.sprite.width,
            this.sprite.height
          )
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            1 * this.sprite.width,
            this.sprite.height * 2,
            this.sprite.width,
            this.sprite.height
          )
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            2 * this.sprite.width,
            this.sprite.height * 2,
            this.sprite.width,
            this.sprite.height
          )
        ),
        new PIXI.Texture(
          this.sshet,
          new PIXI.Rectangle(
            3 * this.sprite.width,
            this.sprite.height * 2,
            this.sprite.width,
            this.sprite.height
          )
        ),
      ],
    };
  }

  draw(): void {
    this.player = new PIXI.AnimatedSprite(this.animations.standDown);
    this.player.scale.set(this.scale, this.scale);
    this.player.anchor.set(0.5); // Set origin to center
    this.player.loop = false; // Avoid loops
    this.player.animationSpeed = 0.2;
    this.game.stage.addChild(this.player);
    this.player.x = this.x;
    this.player.y = this.y;
  }

  isPlayerCentered() {
    return (
      this.player.x > 0 &&
      this.player.x < this.game.view.width &&
      this.player.y > 0 &&
      this.player.y < this.game.view.height
    );
  }

  update(): void {
    if (this.keys.ArrowUp) {
      this.facing = "up";
      if (
        this.map.translateY < 0 ||
        this.player.y > this.game.view.height / 2
      ) {
        this.player.y -= this.speed;
      } else {
        this.map.translateY -= this.speed;
      }

      if (!this.player.playing) {
        this.player.textures = this.animations.walkUp;
        this.player.play();
      }
    }
    if (this.keys.ArrowDown) {
      this.facing = "down";
      if (
        this.map.translateY + this.game.view.height >
          this.map.container.height ||
        this.player.y < this.game.view.height / 2
      ) {
        this.player.y += this.speed;
      } else {
        this.map.translateY += this.speed;
      }
      if (!this.player.playing) {
        this.player.textures = this.animations.walkDown;
        this.player.play();
      }
    }

    if (this.keys.ArrowLeft) {
      this.facing = "left";
      if (this.map.translateX < 0 || this.player.x > this.game.view.width / 2) {
        this.player.x -= this.speed;
      } else {
        this.map.translateX -= this.speed;
      }
      if (!this.player.playing) {
        this.player.textures = this.animations.walkLeft;
        this.player.play();
      }
    }

    if (this.keys.ArrowRight) {
      this.facing = "right";
      if (
        this.map.translateX + this.game.view.width > this.map.container.width ||
        this.player.x < this.game.view.width / 2
      ) {
        this.player.x += this.speed;
      } else {
        this.map.translateX += this.speed;
      }
      if (!this.player.playing) {
        this.player.textures = this.animations.walkRight;
        this.player.play();
      }
    }
    socket.emit("position", {
      x: this.player.x + this.map.translateX,
      y: this.player.y + this.map.translateY,
      playing: this.player.playing,
      facing: this.facing,
      username: this.username,
    });

    // gun
    //   .get("player")
    //   .get("x")
    //   .put(this.player.x + this.map.translateX);
  }
}
