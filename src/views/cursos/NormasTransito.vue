<template>
  <div class="curso-detalle">
    <h1>Normas de Tránsito</h1>
    <div class="curso-info">
      <h2>Descripción del Curso</h2>
      <p>Conoce y aprende todas las normas de tránsito vigentes.</p>
      
      <div class="detalles">
        <div class="detalle-item">
          <strong>Duración:</strong> 20 horas
        </div>
        <div class="detalle-item">
          <strong>Precio:</strong> $120,000
        </div>
        <div class="detalle-item">
          <strong>Tipo:</strong> Curso Corto
        </div>
      </div>

      <div class="contenido">
        <h3>Contenido del Curso</h3>
        <ul>
          <li>Señales de tránsito</li>
          <li>Normas básicas de circulación</li>
          <li>Derechos y obligaciones del conductor</li>
          <li>Infracciones y sanciones</li>
          <li>Documentación necesaria</li>
        </ul>
      </div>

      <div class="inscripcion">
        <button class="btn-inscribirse" @click="inscribirse">Inscribirse al Curso</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NormasTransito',
  methods: {
    inscribirse() {
      // Implementar lógica de inscripción
      console.log('Inscripción al curso de Normas de Tránsito')
    }
  }
})
</script>

<style scoped>
.curso-detalle {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.curso-info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.detalles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.detalle-item {
  padding: 10px;
}

.contenido {
  margin: 20px 0;
}

.contenido ul {
  list-style-type: none;
  padding: 0;
}

.contenido li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.btn-inscribirse {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.btn-inscribirse:hover {
  background-color: #45a049;
}
</style>
