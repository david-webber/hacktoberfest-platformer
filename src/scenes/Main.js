//main game file
export default class extends Phaser.Scene {
	constructor() {
		super({
			key: `Main`
		});
	}

	preload() {
		var progress = this.add.graphics();

		this.load.on('progress', function (value) {
			progress.clear();
			progress.fillStyle(0xffffff, 1);
			progress.fillRect(0, 270, 800 * value, 60);
		});

		this.load.on('complete', function () {
			progress.destroy();
		});

		this.load.setPath('/src/assets/');
		this.load.image('bg', 'Graveyard-bg.png');
		this.load.image('horizon', 'horizon.png');
		this.load.image('path', 'path.png');
		this.load.image('platform', 'platform.png');
		this.load.image('gy3', 'gy3.png');
		this.load.image('pr', 'pull-request.png')
		this.load.image('pumpkin', 'pumpkin.png');

		this.load.spritesheet('dude', 'dude.png', {
			frameWidth: 32,
			frameHeight: 48
		});
	}

	create() {
		const bounds = {
			width: this.game.config.width * 5,
			height: this.game.config.height
		};

		this.physics.world.setBounds(0, 0, bounds.width, bounds.height);

		this.horizon = this.add.tileSprite(0, this.game.config.height - 260, bounds.width * 2, 400, 'horizon').setScale(1.5);
		this.tilesprite = this.add.tileSprite(0, this.game.config.height - 250, bounds.width * 2, 500, 'bg');
		this.path = this.add.tileSprite(0, this.game.config.height, bounds.width * 2, 50, 'path')

		this.horizon.setTint(0x0000dd, 0xddd000, 0x0000dd, 0xdd0000);
		this.tilesprite.setTint(0x999999);


		const platforms = this.physics.add.staticGroup();
		// bottom right platform
		platforms.create(1150, this.game.config.height - (this.game.config.height / 10), 'platform').setScale(0.6).refreshBody();
		// top right platform
		platforms.create(1130, 200, 'platform').setScale(0.1).refreshBody();
		// mid left platform
		platforms.create(198, 250, 'platform').setScale(0.4).refreshBody();


		// added little bounce to sprite
		this.player = this.physics.add.sprite(100, 450, 'dude');

		this.physics.add.collider(this.player, platforms);
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);
		this.player.speed = 200;

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 0,
				end: 3
			}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [{
				key: 'dude',
				frame: 4
			}],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 5,
				end: 8
			}),
			frameRate: 10,
			repeat: -1
		});



		this.cursors = this.input.keyboard.createCursorKeys();

		const prs = this.physics.add.group({
			key: 'pr',
			repeat: 2,
			setXY: {
				x: 1,
				y: 5,
				stepX: 30
			}
		});

		prs.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.1));
		});

		this.physics.add.collider(prs, platforms);
		this.physics.add.overlap(this.player, prs, collectPr, null, this);

		function collectPr(player, pr) {
			pr.disableBody(true, true);
		}

		this.cameras.main.setSize(this.game.config.width, this.game.config.height);
		this.cameras.main.setBounds(0, 0, bounds.width, this.game.config.height + 20);
		this.cameras.main.setZoom(1.5);
		this.cameras.main.startFollow(this.player, true, 0.05, 0.5, -this.game.config.width / 6, 0);

	}


	update() {

		this.horizon.tilePositionX = 0 - this.cameras.main.scrollX * 0.6;
		this.tilesprite.tilePositionX = 0 - this.cameras.main.scrollX * 0.5;

		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-this.player.speed);
			this.player.anims.play('left', true);
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(this.player.speed);
			this.player.anims.play('right', true);
		} else {
			this.player.setVelocityX(0);
			this.player.anims.play('turn');
		}

		if (this.cursors.up.isDown && this.player.body.onFloor()) {
			this.player.setVelocityY(-330);
		}



	}
}