export class Minimap {
  constructor(state, camera, cameraController, workerManager) {
    this.state = state;
    this.camera = camera;
    this.cameraController = cameraController;
    this.workerManager = workerManager;
    this.canvas = document.getElementById('minimap');
    this.ctx = this.canvas?.getContext('2d');
    this.frame = 0;
    this.size = 160;
    this.roomSize = 38;
  }

  update() {
    if (!this.ctx || !this.state.gameStarted) return;
    this.frame += 1;
    if (this.frame % 4 !== 0) return;

    const ctx = this.ctx;
    const scale = this.size / this.roomSize;
    ctx.clearRect(0, 0, this.size, this.size);
    ctx.fillStyle = 'rgba(5,13,20,0.88)';
    ctx.fillRect(0, 0, this.size, this.size);
    ctx.strokeStyle = 'rgba(0,212,200,0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, this.size - 2, this.size - 2);

    ctx.strokeStyle = 'rgba(180,196,210,0.24)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 56);
    ctx.lineTo(80, 104);
    ctx.moveTo(48, 82);
    ctx.lineTo(112, 82);
    ctx.moveTo(48, 32);
    ctx.lineTo(48, 132);
    ctx.moveTo(112, 32);
    ctx.lineTo(112, 132);
    ctx.stroke();

    this.workerManager.workers.forEach((worker) => {
      const x = (worker.group.position.x + this.roomSize / 2) * scale;
      const z = (worker.group.position.z + this.roomSize / 2) * scale;
      ctx.fillStyle = 'rgba(90,70,50,0.55)';
      ctx.fillRect(x - 7, z - 5, 14, 10);
      ctx.fillStyle = worker.data.healthy ? '#00cc88' : '#ff3333';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 7;
      ctx.beginPath();
      ctx.arc(x, z, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    const px = (this.camera.position.x + this.roomSize / 2) * scale;
    const pz = (this.camera.position.z + this.roomSize / 2) * scale;
    ctx.save();
    ctx.translate(px, pz);
    ctx.rotate(this.cameraController.yaw + Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00d4c8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(4, 5);
    ctx.lineTo(-4, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
