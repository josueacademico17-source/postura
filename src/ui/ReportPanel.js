export class ReportPanel {
  constructor(statisticsSystem, notifications) {
    this.statisticsSystem = statisticsSystem;
    this.notifications = notifications;
  }

  showSummary() {
    const stats = this.statisticsSystem.snapshot();
    this.notifications.show(
      `Reporte: productividad ${stats.productivity}%, fatiga media ${stats.averageFatigue}%, empleados sanos ${stats.healthyWorkers}.`,
      'info',
    );
  }
}
