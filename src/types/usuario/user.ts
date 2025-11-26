type UserRole = 'ADMIN' | 'ARQUITETO' | 'ENGENHEIRO';

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

