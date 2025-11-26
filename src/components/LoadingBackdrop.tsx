import { Backdrop, CircularProgress, Typography } from '@mui/material';
import { useAppSelector } from '../store/hooks';

export default function LoadingBackdrop() {
  const { isLoading, message } = useAppSelector((state) => state.loading);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
      {message && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Backdrop>
  );
}