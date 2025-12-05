type UserRole = 'ADMIN' | 'ARQUITETO' | 'ENGENHEIRO' | 'GESTOR_PUBLICO' | 'PROFESSOR' | 'TECNICO_EDIFICACOES' | 'CONSULTOR_SUSTENTABILIDADE' | 'ESTUDANTE';

interface User {
  userId: number;
  email: string;
  nome: string;
}


interface UsuarioDTO {
    id : number;
    nome: string
    email: string,
}


export type { User, UserRole, UsuarioDTO };

