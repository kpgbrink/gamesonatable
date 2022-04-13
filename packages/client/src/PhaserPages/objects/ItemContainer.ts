import { CountdownTimer } from "./CountdownTimer";
import { calculateMovementFromTimer, IMoveItemOverTime, ITableItem, millisecondToSecond, PositionAndRotation } from "./Tools";

export default class ItemContainer extends Phaser.GameObjects.Container implements ITableItem {
    velocity: { x: number, y: number, rotation: number } = { x: 0, y: 0, rotation: 0 };
    mass: number = 1;

    inUserHandId: string | null = null;

    moveOnDuration: IMoveItemOverTime | null = null;

    isDragging: boolean = false;

    public startMovingOverTimeTo(toPosition: PositionAndRotation, time: number, onMovementEndCallBack?: () => void) {
        this.velocity = { x: 0, y: 0, rotation: 0 };
        this.moveOnDuration = {
            movementCountdownTimer: new CountdownTimer(time),
            startPosition: { x: this.x, y: this.y, rotation: this.rotation },
            endPosition: toPosition,
            onMovementEndCallBack: onMovementEndCallBack || null
        };
    }

    public moveOverTime(time: number, delta: number) {
        if (!this.moveOnDuration) return;
        if (this.moveOnDuration.movementCountdownTimer.wasDone()) {
            if (this.moveOnDuration.onMovementEndCallBack) {
                this.moveOnDuration.onMovementEndCallBack();
            }
            this.moveOnDuration = null;
            return;
        }
        const movement = calculateMovementFromTimer(
            this.moveOnDuration.movementCountdownTimer,
            delta,
            this.moveOnDuration.startPosition,
            { x: this.x, y: this.y, rotation: this.rotation },
            this.moveOnDuration.endPosition
        );
        this.x += movement.x;
        this.y += movement.y;
        this.rotation += movement.rotation;
        this.moveOnDuration.movementCountdownTimer.update(delta);
    }

    public moveFromVelocity(delta: number) {
        this.x += this.velocity.x * millisecondToSecond(delta);
        this.y += this.velocity.y * millisecondToSecond(delta);
        this.rotation += this.velocity.rotation * millisecondToSecond(delta);
    }

    public update(time: number, delta: number) {
        this.moveOverTime(time, delta);
        this.moveFromVelocity(delta);
    }

    public setScaleAndSize(scale: number) {
        this.setScale(scale);
        this.setSize(this.width * scale, this.height * scale);
    }
}