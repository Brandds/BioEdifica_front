import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Colors } from "../../styles/Colors";

type Props = {
  openDeleteDialog: boolean;
  projetoToDelete: { nome: string } | null;
  handleCloseDeleteDialog: () => void;
  handleConfirmDelete: () => void;
}


export default function ModalConfirmacao({
  openDeleteDialog,
  projetoToDelete,
  handleCloseDeleteDialog,
  handleConfirmDelete
}: Props) {
  return (
    <Dialog
      open={openDeleteDialog}
      onClose={handleCloseDeleteDialog}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title" sx={{ color: Colors.preto }}>
        Confirmar Exclusão
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description" sx={{ color: Colors.cinzaTexto }}>
          Tem certeza que deseja excluir o projeto "{projetoToDelete?.nome}"?
          Esta ação não pode ser desfeita.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleCloseDeleteDialog}
          variant="outlined"
          sx={{
            borderColor: Colors.cinzaTexto,
            color: Colors.cinzaTexto,
            '&:hover': {
              borderColor: Colors.preto,
              backgroundColor: 'transparent'
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          color="error"
          sx={{
            backgroundColor: '#d32f2f',
            '&:hover': {
              backgroundColor: '#b71c1c'
            }
          }}
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  )
}