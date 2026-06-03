import * as THREE from 'three';
import { EventBus } from './EventBus.js';
import { AssetLoader } from './AssetLoader.js';
import { SceneManager } from './SceneManager.js';
import { SaveManager } from './SaveManager.js';
import { Renderer } from '../rendering/Renderer.js';
import { PostProcessing } from '../rendering/PostProcessing.js';
import { InputManager } from '../player/InputManager.js';
import { CameraController } from '../player/CameraController.js';
import { PlayerController } from '../player/PlayerController.js';
import { InteractionSystem } from '../player/InteractionSystem.js';
import { WorkerManager } from '../npc/WorkerManager.js';
import { ErgonomicScanner } from '../scanner/ErgonomicScanner.js';
import { BudgetSystem } from '../systems/BudgetSystem.js';
import { ProductivitySystem } from '../systems/ProductivitySystem.js';
import { HealthSystem } from '../systems/HealthSystem.js';
import { AchievementSystem } from '../systems/AchievementSystem.js';
import { NarrativeSystem } from '../systems/NarrativeSystem.js';
import { StatisticsSystem } from '../systems/StatisticsSystem.js';
import { HUD } from '../ui/HUD.js';
import { InspectionPanel } from '../ui/InspectionPanel.js';
import { Notifications } from '../ui/Notifications.js';
import { ReportPanel } from '../ui/ReportPanel.js';
import { PauseMenu } from '../ui/PauseMenu.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.state = {
      budget: 5000,
      productivity: 54,
      transformLevel: 0,
      scannerActive: false,
      selectedNPC: null,
      shopOpen: false,
      gameStarted: false,
      paused: false,
      totalPurchases: 0,
      scannedNPCs: new Set(),
    };
    this.clock = new THREE.Clock();
    this.eventBus = new EventBus();
    this.assetLoader = new AssetLoader();
    this.saveManager = new SaveManager();
  }

  init() {
    this.renderer = new Renderer(this.canvas);
    this.sceneManager = new SceneManager(this.assetLoader, this.renderer.renderer);
    this.sceneManager.build();

    this.workerManager = new WorkerManager(this.sceneManager.scene, this.sceneManager.workstations);
    this.workerManager.build();
    this.colliders = [...this.sceneManager.colliders, ...this.workerManager.colliders];

    this.notifications = new Notifications();
    this.hud = new HUD(this.state, this.eventBus);
    this.hud.setup();
    this.input = new InputManager(this.eventBus);
    this.input.setup();
    this.cameraController = new CameraController(this.canvas, this.sceneManager.camera, this.eventBus, this.hud);
    this.cameraController.setup();
    this.player = new PlayerController(
      this.sceneManager.camera,
      this.input,
      this.cameraController,
      this.colliders,
      this.state,
    );
    this.interaction = new InteractionSystem(this.sceneManager.camera, this.workerManager, this.hud, this.eventBus);

    this.budgetSystem = new BudgetSystem(this.state, this.eventBus);
    this.productivitySystem = new ProductivitySystem(this.state, this.workerManager, this.eventBus);
    this.healthSystem = new HealthSystem(this.state, this.workerManager, this.productivitySystem, this.eventBus);
    this.statisticsSystem = new StatisticsSystem(this.state, this.workerManager);
    this.inspectionPanel = new InspectionPanel(
      this.state,
      this.eventBus,
      this.workerManager,
      this.budgetSystem,
      this.productivitySystem,
      this.notifications,
    );
    this.inspectionPanel.setup();
    this.scanner = new ErgonomicScanner(
      this.state,
      this.sceneManager.camera,
      this.sceneManager.scene,
      this.workerManager,
      this.eventBus,
      this.inspectionPanel,
      this.notifications,
    );
    this.scanner.setup();
    this.reportPanel = new ReportPanel(this.statisticsSystem, this.notifications);
    this.pauseMenu = new PauseMenu(this.state, this.notifications);
    this.achievementSystem = new AchievementSystem(this.state, this.eventBus, this.notifications);
    this.achievementSystem.setup();
    this.narrativeSystem = new NarrativeSystem(this.state, this.eventBus, this.notifications, this.budgetSystem);
    this.narrativeSystem.setup();
    this.postProcessing = new PostProcessing(this.renderer.renderer, this.sceneManager.scene, this.sceneManager.camera);

    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    this.hud.onStart(() => {
      this.state.gameStarted = true;
      this.eventBus.emit('game:started');
      this.notifications.show('Mision iniciada. Usa Q para activar el escaner postural.', 'success');
    });

    this.eventBus.on('input:shop', () => {
      if (this.state.gameStarted) this.inspectionPanel.toggle();
    });
    this.eventBus.on('input:interact', () => {
      if (this.state.gameStarted) this.interaction.interact();
    });
    this.eventBus.on('input:report', () => {
      if (this.state.gameStarted) this.reportPanel.showSummary();
    });
    this.eventBus.on('input:escape', () => {
      if (this.state.shopOpen) this.inspectionPanel.close();
      else if (this.state.gameStarted) this.pauseMenu.toggle();
    });
    this.eventBus.on('worker:selected', (worker) => {
      this.inspectionPanel.selectWorker(worker.id);
    });
    this.eventBus.on('budget:income', ({ amount, reason }) => {
      if (reason === 'passive') this.notifications.show(`Ingresos recibidos: +${amount} EUR`, 'success');
      if (reason === 'ceo_bonus') this.notifications.show(`Bonus CEO: +${amount} EUR`, 'success');
    });
    this.eventBus.on('transform:changed', (level) => {
      this.sceneManager.setTransformation(level);
      this.postProcessing.setTransformation(level);
      this.saveManager.save(this.state);
    });
    this.eventBus.on('budget:changed', () => this.saveManager.save(this.state));
    this.eventBus.on('productivity:changed', (value) => {
      this.eventBus.emit('narrative:productivity', value);
      this.saveManager.save(this.state);
    });

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.resize(width, height);
    this.sceneManager.resize(width, height);
    this.postProcessing.resize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const dt = Math.min(this.clock.getDelta(), 0.04);
    const elapsed = this.clock.getElapsedTime();
    this.player.update(dt);
    this.interaction.update();
    this.scanner.update(elapsed);
    this.workerManager.update(elapsed, this.sceneManager.camera);
    this.budgetSystem.update(elapsed);
    this.healthSystem.update(elapsed);
    this.postProcessing.render();
  }
}
