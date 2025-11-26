import { Colors } from "../../styles/Colors";

const zoneamentoBoxMapsSx = {
  minHeight: '100vh',
  backgroundColor: Colors.fundo,
  width: '100%' 
}

const zoneamentoContainerSx = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  px: 0,
}

const zoneamentoBoxPosContainerSx = {
  width: '100%',
  height: '85vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: 5,
}

const zoneamentoBiografia = {
  textAlign: 'center',
  mt: 6,
  color: '#388e3c' 
}

const zoneamentoBiografiaSx ={
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 'bold',
  textAlign: 'center',
  mt: 6,
  fontSize: '30px',
  color: Colors.verdeBioEdifica
}

const zoneamentoCardSx ={
  width: '100%',
}


export { zoneamentoBiografia, zoneamentoBiografiaSx, zoneamentoBoxMapsSx, zoneamentoBoxPosContainerSx, zoneamentoCardSx, zoneamentoContainerSx };

