import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

import loginBackground from '../../../assets/fondo_login.png';
import AuthLayout from './AuthLayout';
import FormField from './FormField';
import { LockIcon, EyeIcon, CheckIcon, ArrowLeftIcon } from './icons';
import AuthService from '../services/authService';

export default function ActivarCuenta() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      setError('No se proporcionó ningún token de activación.');
      return;
    }

    const checkToken = async () => {
      try {
        setVerifying(true);
        const res = await AuthService.verifyActivationToken(token);
        const data = res?.data || res;
        setUserInfo(data);
        setTokenValid(true);
      } catch (err) {
        console.error('Error al verificar token:', err);
        setTokenValid(false);
        setError(
          err.response?.data?.message ||
          'El enlace de activación es inválido o ha expirado. Comunícate con el administrador.'
        );
      } finally {
        setVerifying(false);
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!tokenValid) {
      setError('El enlace de activación no es válido.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      await AuthService.activateAccount({ token, password });
      setSuccess(true);
    } catch (err) {
      console.error('Error activando cuenta:', err);
      setError(
        err.response?.data?.message ||
        'No se pudo activar la cuenta. Es posible que el enlace haya expirado.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout backgroundImage={loginBackground}>
      <div className="w-full">
        {/* Cabecera */}
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-3 font-medium"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            Volver al inicio de sesión
          </Link>
          <p className="text-xs uppercase tracking-widest text-[#ea580c] font-bold mb-1">
            Activación de Cuenta
          </p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {success
              ? '¡Cuenta activada!'
              : 'Configura tu contraseña'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {success
              ? 'Tu contraseña fue guardada exitosamente y tu cuenta ya se encuentra activa.'
              : userInfo?.nombre
                ? `Hola ${userInfo.nombre}, establece tu contraseña personal para acceder al sistema.`
                : 'Ingresa tu nueva contraseña para activar tu acceso.'}
          </p>
        </div>

        {/* Verificando estado inicial */}
        {verifying && (
          <div className="py-12 text-center text-sm text-slate-600">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mb-3" />
            <p>Verificando enlace de activación...</p>
          </div>
        )}

        {/* Error de token inválido / expirado */}
        {!verifying && !tokenValid && !success && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs mb-4">
            <p className="font-semibold mb-1">Enlace no válido</p>
            <p>{error}</p>
            <div className="mt-3">
              <Link
                to="/login"
                className="inline-block bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Ir a Iniciar Sesión
              </Link>
            </div>
          </div>
        )}

        {/* Éxito */}
        {success && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckIcon className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-600 mb-6">
              Ya puedes ingresar a la plataforma utilizando tu correo electrónico y la contraseña que acabas de establecer.
            </p>
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              Iniciar sesión ahora
            </Link>
          </div>
        )}

        {/* Formulario de contraseña */}
        {!verifying && tokenValid && !success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs">
                {error}
              </div>
            )}

            {userInfo?.correo && (
              <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-600">
                <span className="font-medium text-slate-700">Correo asignado:</span>{' '}
                {userInfo.correo}
              </div>
            )}

            <FormField
              label="Nueva contraseña"
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              leftIcon={<LockIcon />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  <EyeIcon />
                </button>
              }
            />

            <FormField
              label="Confirmar contraseña"
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              required
              leftIcon={<LockIcon />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label="Mostrar u ocultar confirmación de contraseña"
                >
                  <EyeIcon />
                </button>
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Activando cuenta...' : 'Activar cuenta y guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

