import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuienesSomosView from '../views/QuienesSomosView.vue'
import PoliticaDatosView from '../views/PoliticaDatosView.vue'
import AutorizacionDatosView from '../views/AutorizacionDatosView.vue'
import CursosView from '../views/CursosView.vue'
import TecnicosView from '../views/TecnicosView.vue'
import DiplomadosView from '../views/DiplomadosView.vue'
import LoginEstudianteView from '../views/LoginEstudianteView.vue'
import LoginProfesorView from '../views/LoginProfesorView.vue'
import EstudianteDashboardView from '../views/DashboardEstudianteView.vue'
import ProfesorDashboardView from '../views/DashboardProfesorView.vue'
import RegistroEstudianteView from '../views/RegistroEstudianteView.vue'
import RegistroProfesorView from '../views/RegistroProfesorView.vue'
import CampusVirtualView from '../views/CampusVirtualView.vue'
// Importar las vistas de cursos específicos
import ManejoDefensivo from '../views/cursos/ManejoDefensivo.vue'
import PrimerosAuxilios from '../views/cursos/PrimerosAuxilios.vue'
import MecanicaBasica from '../views/cursos/MecanicaBasica.vue'
import NormasTransito from '../views/cursos/NormasTransito.vue'
import TransporteSustanciasPeligrosas from '../views/cursos/TransporteSustanciasPeligrosas.vue'
import GestionarCursoView from '../views/GestionarCursoView.vue'
import CursoInscritoView from '../views/CursoInscritoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/quienes-somos',
      name: 'quienes-somos',
      component: QuienesSomosView
    },
    {
      path: '/politica-datos',
      name: 'politica-datos',
      component: PoliticaDatosView
    },
    {
      path: '/autorizacion-datos',
      name: 'autorizacion-datos',
      component: AutorizacionDatosView
    },
    {
      path: '/cursos',
      name: 'cursos',
      component: CursosView
    },
    {
      path: '/tecnicos',
      name: 'tecnicos',
      component: TecnicosView
    },
    {
      path: '/diplomados',
      name: 'diplomados',
      component: DiplomadosView
    },
    {
      path: '/login/estudiante',
      name: 'login-estudiante',
      component: LoginEstudianteView
    },
    {
      path: '/login/profesor',
      name: 'login-profesor',
      component: LoginProfesorView
    },
    {
      path: '/estudiante/dashboard',
      name: 'estudiante-dashboard',
      component: EstudianteDashboardView
      // TODO: Add authentication guard
    },
    {
      path: '/profesor/dashboard',
      name: 'profesor-dashboard',
      component: ProfesorDashboardView
      // TODO: Add authentication guard
    },
    {
      path: '/registro/estudiante',
      name: 'registro-estudiante',
      component: RegistroEstudianteView
    },
    {
      path: '/registro/profesor',
      name: 'registro-profesor',
      component: RegistroProfesorView
    },
    {
      path: '/campus-virtual',
      name: 'campus-virtual',
      component: CampusVirtualView
    },
    {
      path: '/curso/manejo-defensivo',
      name: 'manejo-defensivo',
      component: ManejoDefensivo
    },
    {
      path: '/curso/primeros-auxilios',
      name: 'primeros-auxilios',
      component: PrimerosAuxilios
    },
    {
      path: '/curso/mecanica-basica',
      name: 'mecanica-basica',
      component: MecanicaBasica
    },
    {
      path: '/curso/normas-transito',
      name: 'normas-transito',
      component: NormasTransito
    },
    {
      path: '/curso/transporte-sustancias-peligrosas',
      name: 'transporte-sustancias-peligrosas',
      component: TransporteSustanciasPeligrosas
    },
    {
      path: '/curso/:id/gestionar',
      name: 'gestionar-curso',
      component: GestionarCursoView,
      meta: { requiresAuth: true, teacherOnly: true }
    },
    {
      path: '/curso/:id/ver',
      name: 'ver-curso',
      component: CursoInscritoView,
      meta: { requiresAuth: true }
    }
  ]
})

export default router
