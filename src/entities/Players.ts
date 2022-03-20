import * as PIXI from "pixi.js";
import Map from "./Map";
import { AnimatedSprite } from "pixi.js";
interface Sprite {
  source: string;
  width: number;
  height: number;
}

interface Options {
  map: Map;
  username: string;
  scale: number;
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

export default class Players {
  private game: PIXI.Application;
  private animations!: Animations;
  private scale: number;
  private sshet: PIXI.BaseTexture;
  public playerSprites: { [key: string]: PIXI.AnimatedSprite } = {};
  public map: Map;
  public username: string;
  public sprite: Sprite;

  static PLAYER_KEYS = ["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"];
  static activePlayers: any = {};
  public playersSprites: { [key: string]: PIXI.AnimatedSprite[] } = {};

  constructor({ username, game, map, sprite, scale }: Options) {
    this.game = game;
    this.sshet = new PIXI.BaseTexture(sprite.source);
    this.sshet.scaleMode = 0; // NEAREST
    this.map = map;
    this.scale = scale;
    this.sprite = sprite;
    this.username = username;
    this.setAnimations();
    this.drawAll();
    this.game.ticker.add(this.update.bind(this));
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

  drawOne(player: string): void {
    const p: AnimatedSprite = new PIXI.AnimatedSprite(this.animations.walkLeft);
    p.scale.set(this.scale, this.scale);
    p.anchor.set(0.5); // Set origin to center
    p.loop = false; // Avoid loops
    p.animationSpeed = 0.2;
    this.map.container.addChild(p); // Important add to map container
    p.x = Players.activePlayers[player].x;
    p.y = Players.activePlayers[player].y;
    this.playerSprites[player] = p;
  }

  drawAll(): void {
    Object.keys(Players.activePlayers).forEach((player: string) => {
      if (player !== this.username && Players.activePlayers[player]) {
        const p: any = new PIXI.AnimatedSprite(this.animations.walkLeft);
        p.scale.set(this.scale, this.scale);
        p.anchor.set(0.5); // Set origin to center
        p.loop = false; // Avoid loops
        p.animationSpeed = 0.2;
        this.map.container.addChild(p); // Important add to map container
        p.x = Players.activePlayers[player].x;
        p.y = Players.activePlayers[player].y;
        this.playerSprites[player] = p;
      }
    });
  }

  update(): void {
    Object.keys(Players.activePlayers).forEach((player: string) => {
      const p = Players.activePlayers[player];
      if (this.playerSprites[player]) {
        //   if (!this.playerSprites[player] && Players.activePlayers[player]) {
        //     this.drawOne(player);
        //     return;
        //   }

        if (p && p.facing) {
          this.playerSprites[player].x = p.x;
          this.playerSprites[player].y = p.y;
          // console.log("Facing is", facing);
          switch (p.facing) {
            case "up":
              this.playerSprites[player].textures = this.animations.walkUp;
              break;
            case "left":
              this.playerSprites[player].textures = this.animations.walkLeft;
              break;
            case "right":
              this.playerSprites[player].textures = this.animations.walkRight;
              break;
            case "down":
              this.playerSprites[player].textures = this.animations.walkDown;
              break;
            // default:
            //   this.playerSprites[player].textures = this.animations.standDown;
            //   break;
          }
        }
        if (p.playing) {
          this.playerSprites[player].play();
        } else {
          this.playerSprites[player].gotoAndStop(1);
        }
      } else if (!this.playerSprites[player] && Players.activePlayers[player]) {
        this.drawOne(player);
      }
    });

    // gun
    //   .get("player")
    //   .get("x")
    //   .put(this.player.x + this.map.translateX);
  }
}
