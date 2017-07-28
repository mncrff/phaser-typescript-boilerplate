import * as Phaser from "phaser-ce";
import * as Greeter from "./lib/greeter";

class SimpleGame {

    public game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, "content", { preload: this.preload, create: this.create });
    }

    private preload() {
        this.game.load.image("logo", "assets/images/phaser-logo-small.png");
    }

    private create() {
        const logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
        logo.anchor.setTo(0.5, 0.5);
    }

}

window.onload = () => {

    const game = new SimpleGame();
    const greeter = new Greeter.GreeterClass();
    greeter.greet();

};
