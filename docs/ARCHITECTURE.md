# Arquitectura

Inspector Postural usa una arquitectura modular:

- `src/core`: ciclo de vida, eventos, escena, carga y guardado.
- `src/player`: input, camara FPS, movimiento y colisiones.
- `src/scanner`: analisis ergonomico, overlay y efectos holograficos.
- `src/npc`: trabajadores, posturas, sintomas y animaciones.
- `src/office`: edificio, areas, decoracion, estaciones y colliders.
- `src/systems`: presupuesto, productividad, salud, logros, narrativa y estadisticas.
- `src/ui`: HUD, tienda, reportes, pausa y notificaciones.
- `src/rendering`: renderer, iluminacion, sombras, entorno y postprocesado.
- `src/data`: datos JSON editables.
