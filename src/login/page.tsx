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
  Alert,
  CircularProgress,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

export default function LoginPage() {
  const [employeeCode, setEmployeeCode] = React.useState('');
  const [pin, setPin] = React.useState('');
  const [showPin, setShowPin] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await apiClient.login(employeeCode, pin);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPin = () => setShowPin((show) => !show);

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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Código de Empleado"
            name="employeeCode"
            type="text"
            fullWidth
            required
            size="small"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            margin="normal"
            placeholder="EMP001, SUP001, ADM001..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth variant="outlined" size="small" margin="normal">
            <InputLabel htmlFor="outlined-adornment-pin">
              PIN
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-pin"
              type={showPin ? 'text' : 'password'}
              name="pin"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="1234"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle pin visibility"
                    onClick={handleClickShowPin}
                    edge="end"
                    size="small"
                  >
                    {showPin ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="PIN"
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
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Códigos de prueba: EMP001, EMP002, SUP001, ADM001
              <br />
              PIN: 1234 (para todos)
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
