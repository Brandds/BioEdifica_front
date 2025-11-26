import TextField from '@mui/material/TextField';
import type { SxProps } from '@mui/material/styles';

type CampoAbertoProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  sx?: SxProps; // estilização customizada opcional
  multiline?: boolean;
  rows?: number;
};

export function CampoAberto({
  label,
  value,
  onChange,
  placeholder,
  sx,
  multiline = false,
  rows = 1,
}: CampoAbertoProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      multiline={multiline}
      rows={rows}
      sx={{
        margin: '8px 0',
        background: '#fff',
        borderRadius: '6px',
        ...sx, // sobrescreve se passado
      }}
    />
  );
}