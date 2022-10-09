


export default class MenuButton extends Phaser.GameObjects.Text {
    constructor(x: number, y: number, scene: Phaser.Scene) {
        super(scene, x, y, '', {
            fontSize: '100px',
            color: '#bf930f',
            stroke: '#bf930f',
            strokeThickness: 4
        });
        this.setOrigin(0.5);
        this.setPadding(20);
        this.setStyle({ backgroundColor: '#111' });
        this.setInteractive({ useHandCursor: true });
        this.on('pointerover', () => { this.setStyle({ fill: '#f0bc22' }); });
        this.on('pointerout', () => { this.setStyle({ fill: '#bf930f' }); });
        // this.setDepth(100);
    }
}