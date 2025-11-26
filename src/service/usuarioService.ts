import URL_ENDPOINTS from "../constants/URL_ENDPOINTS";
import type { CadastroForm } from "../pages/Cadastro";
import type { LoginResponse } from "../types/usuario/auth";
import type { UsuarioDTO } from "../types/usuario/user";
import { httpRequest } from "./api";

export const usuarioService = {
  buscarUsuarioPorId,
  atualizarUsuario,
  deletarUsuario,
  criarUsuario
}

async function buscarUsuarioPorId(id: number): Promise<UsuarioDTO> {
  const url = URL_ENDPOINTS.USUARIO.BUSCAR_POR_ID + id;
  const response = await httpRequest<UsuarioDTO>({
    url,
    method: 'GET',
  });
  return response;
}

async function atualizarUsuario(id: number, usuario: UsuarioDTO): Promise<UsuarioDTO> {
  const url = URL_ENDPOINTS.USUARIO.ATUALIZAR_USUARIO + id;
  const response = await httpRequest<UsuarioDTO>({
    url,
    method: 'PUT',
    body: usuario,
  });
  return response;
}

async function deletarUsuario(id: number): Promise<void> {
  const url = URL_ENDPOINTS.USUARIO.DELETAR_USUARIO + id;
  await httpRequest<void>({
    url,
    method: 'DELETE',
  });
}

async function criarUsuario(usuario: CadastroForm): Promise<LoginResponse> {
  const url = URL_ENDPOINTS.USUARIO.CRIAR_USUARIO;
  const response = await httpRequest<LoginResponse>({
    url,
    method: 'POST',
    body: usuario,
  });
  return response;
}