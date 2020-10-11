//Loading screen, preload assets here etc


// eslint-disable-next-line no-undef
export default class extends Phaser.Scene {
	constructor() {
		super({
			key: "Start"
		});
	}

	create() {
		this.add.text(16, 16, 'Click to start (switch scene)', {
			fontSize: '32px',
			fill: '#fff'
		});

		this.input.on('pointerdown', function () {
			this.input.stopPropagation();
			this.scene.switch('Main');
		}, this);
	}

}