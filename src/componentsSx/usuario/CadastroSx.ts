import { Colors } from "../../styles/Colors";

const campoNomeCadastroSx = {
  '& .MuiInputLabel-root': {
    color: Colors.preto,
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: Colors.branco,
    '&:hover fieldset': {
      borderColor: Colors.verdePrincipal,
    },
    '&.Mui-focused fieldset': {
      borderColor: Colors.verdePrincipal,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: Colors.verdePrincipal,
  },
}


const campoEmailCadastroSx  = {
   mb: 2,
  '& .MuiInputLabel-root': {
    color: Colors.preto,
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: Colors.branco,
    '&:hover fieldset': {
      borderColor: Colors.verdePrincipal,
    },
    '&.Mui-focused fieldset': {
      borderColor: Colors.verdePrincipal,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: Colors.verdePrincipal,
  },
}

const campoSenhaCadastroSx  = {
  '& .MuiInputLabel-root': {
    color: Colors.preto,
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: Colors.branco,
    '&:hover fieldset': {
      borderColor: Colors.verdePrincipal,
    },
    '&.Mui-focused fieldset': {
      borderColor: Colors.verdePrincipal,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: Colors.verdePrincipal,
  },
}

const buttonCadastroSx  = {
  py: 1.5,
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  mb: 2,
  background: `linear-gradient(90deg, ${Colors.verdeEscuro} 60%, ${Colors.verdeClaro} 100%)`,
  '&:hover': {
    background: `linear-gradient(90deg, ${Colors.verdePrincipal} 60%, ${Colors.verdeEscuro} 100%)`,
  },
  '&:disabled': {
    background: Colors.cinzaTexto,
  },
}

const linkTenhoContaCadastroSx  = {
  color: Colors.verdeEscuro,
  fontWeight: 600,
  textDecoration: 'underline',
  textTransform: 'none',
  '&:hover': {
    color: Colors.verdePrincipal,
    backgroundColor: 'transparent',
  },
}

export { buttonCadastroSx, campoEmailCadastroSx, campoNomeCadastroSx, campoSenhaCadastroSx, linkTenhoContaCadastroSx };

