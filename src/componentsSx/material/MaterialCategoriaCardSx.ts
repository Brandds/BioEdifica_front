const materialCardSx = {
  background: '#fff',
  borderRadius: 2,
  boxShadow: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const materialCardImagemSx = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const materialCardDetalhesSx = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  bgcolor: 'rgba(44,62,80,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.3s',
  zIndex: 2,
}

const buttonDetalhesSx = {
  boxShadow: 4,
  px: 4,
  py: 1.2,
  fontWeight: 600,
  bgcolor: 'rgba(56,142,60,0.95)',
  color: '#fff',
  borderRadius: 2,
  width: '80%',
  transition: 'background 0.2s',
    '&:hover': {
    bgcolor: 'rgba(46,125,50,1)',
  },
}


export { buttonDetalhesSx, materialCardDetalhesSx, materialCardImagemSx, materialCardSx };

