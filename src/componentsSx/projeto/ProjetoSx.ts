import { Colors } from "../../styles/Colors";

const botaoFluanteSx = {
  position: 'fixed',
  bottom: 32,
  right: 32,
  backgroundColor: Colors.verdeBioEdifica,
  color: Colors.branco,
  '&:hover': {
     backgroundColor: Colors.verdeEscuro,
  },
}

const titleProjetoSx = {
  fontWeight: 'bold',
  color: Colors.preto,
  mb: 4,
  textAlign: 'left'
}

const containerListProjetosSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
  },
  gap: 3,
  mb: 4,
}

const cardProjetoSx = {
  backgroundColor: Colors.branco,
  borderRadius: 2,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}

const iconCardProjetoSx = {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
}

const cardActionsSx = {
  justifyContent: 'center',
  gap: 1,
  pb: 2,
}

const botaoActionSx = {
   backgroundColor: Colors.verdeBioEdifica,
   color: Colors.branco,
   fontWeight: 'bold',
   '&:hover': {
     backgroundColor: Colors.verdeEscuro,
   },
}



export { botaoActionSx, botaoFluanteSx, cardActionsSx, cardProjetoSx, containerListProjetosSx, iconCardProjetoSx, titleProjetoSx };

