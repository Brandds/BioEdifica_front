export const MaterialCardContainerSx = {
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  backgroundColor: '#fff',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transform: 'translateY(-4px)',
  },
}
export  const MaterialCardBoxContainerImagemSx = {
  position: 'relative',
  width: '100%',
  height: 160,
  overflow: 'hidden',
}

export const MaterialCardBoxImgemSx  =  (hover: boolean) => ({
  width: '100%',
  height: 160,
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
  transform: hover ? 'scale(1.1)' : 'scale(1)'
});


export const MaterialCardImagemSx = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fadeIn 0.3s ease',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
}

export const MaterialCardButtonDetalhesSx = {
  fontWeight: 600,
  textTransform: 'none',
  px: 3,
}

export const MaterialCardBoxInformacaoSx = {
  p:2,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
}


export const MaterialCardTitleInformacaoSx = {
  color: 'var(--verde-principal)',
  fontWeight: 600,
  fontSize: '1.1rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

export const MaterialCardBoxInformacaoBottonsSx = {
  display: 'flex',
  gap:1,
  flexWrap: 'wrap',
}


export const MaterialCardInformacaoBottonsSx ={
  backgroundColor: '#e8f5e9',
  color: '#2e7d32',
  fontWeight: 500,
}

export const MaterialCardBoxInformacaoFooterSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mt: 0.5,
}

export const MaterialCardBoxInformacaoFooterTitlesSx = {
  color: 'var(--cinza-texto)',
  fontWeight: 500,
}