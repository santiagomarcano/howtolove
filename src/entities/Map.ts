import * as PIXI from "pixi.js";
import { Container } from "pixi.js";

interface Options {
  game: PIXI.Application;
  level: any;
  tileSheet: any;
}

export default class Map {
  private game: PIXI.Application;
  public container: Container = new PIXI.Container();
  public translateX: number = 0;
  public translateY: number = 0;

  constructor({ game, level, tileSheet }: Options) {
    this.game = game;
    const tileset = new PIXI.BaseTexture(tileSheet);
    this.game.ticker.add(this.update.bind(this));
    this.createMap(level, tileset);
  }

  private createMap(level: any, tileset: any): void {
    // load json
    // var level = require(level)
    var tileHeight = 32;
    var tileWidth = 32;
    var layers = level.layers;
    var height = level.height;
    var width = level.width;

    for (var l = 0; l < layers.length; l++) {
      // Layer
      var data = layers[l].data;

      if (data) {
        for (let i = 0; i < data.length; i++) {
          // Postition on screen
          const y = (i / height) | 0;
          const x = i % width | 0;
          // Which tile we should use
          if (data[i] != 0) {
            var tileRow = (data[i] / 32) | 0;
            var tileCol = (data[i] % 30) - 1;
            var text = new PIXI.Texture(
              tileset,
              new PIXI.Rectangle(
                tileCol * tileWidth,
                tileRow * tileHeight,
                tileWidth,
                tileHeight
              )
            );
            var layer = new PIXI.Sprite(text);
            layer.x = x * tileHeight;
            layer.y = y * tileWidth;
            this.container.addChild(layer);
          }
        }
        this.game.stage.addChild(this.container);
      }
    }
  }

  update(): void {
    this.container.position.x = -this.translateX;
    this.container.position.y = -this.translateY;
  }
}
