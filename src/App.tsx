import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoadingBackdrop from './components/LoadingBackdrop'
import ProtectedRoute from './components/ProtectedRoute'
import Cadastro from './pages/Cadastro'
import CidadeDetalhe from './pages/cidade/CidadeDetalhe'
import NotFound from './pages/feedback/NotFound'
import Home from './pages/home/Home'
import Login from './pages/Login'
import MateriaisCategoria from './pages/material/categoria/MateriaisCategoria'
import MaterialDetalhe from './pages/material/MaterialDetalhe'
import ProjetoDetalhe from './pages/projeto/ProjetoDetalhe'
import ProjetoNovo from './pages/projeto/ProjetoNovo'
import Projetos from './pages/projeto/Projetos'
import Perfil from './pages/usuario/Perfil'
import ZoneamentoMaps from './pages/zoneamento/ZoneamentoMaps'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />

        {/* Rotas Protegidas - Requerem Autenticação */}
        <Route path="/projetos" element={<ProtectedRoute><Projetos /></ProtectedRoute>} />
        <Route path="/materiais" element={<ProtectedRoute><MateriaisCategoria /></ProtectedRoute>} />
        <Route path="/material/:id" element={<ProtectedRoute><MaterialDetalhe /></ProtectedRoute>} />
        <Route path="/cidade/:id" element={<ProtectedRoute><CidadeDetalhe /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/projeto/novo" element={<ProtectedRoute><ProjetoNovo /></ProtectedRoute>} />
        <Route path="/projeto/:id" element={<ProtectedRoute><ProjetoDetalhe /></ProtectedRoute>} />
        <Route path="/mapsZona" element={<ProtectedRoute><ZoneamentoMaps /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <LoadingBackdrop />
    </>
  )
}
