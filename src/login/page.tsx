import * as React from 'react';
import {
  Box,
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === 'admin@test.com' && password === '1234') {
      alert('Inicio de sesión exitoso ✅');
      navigate('/dashboard');
    } else {
      alert('❌ Credenciales incorrectas');
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Iniciar sesión
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth variant="outlined" size="small" margin="normal">
            <InputLabel htmlFor="outlined-adornment-password">
              Contraseña
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Contraseña"
            />
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                color="primary"
              />
            }
            label="Recordarme"
            sx={{ mt: 1 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
