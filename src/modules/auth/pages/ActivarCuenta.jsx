import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AuthService from '../services/authService';

function parseJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

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
        const data = res?.data || res || {};
        const jwtPayload = parseJwtPayload(token) || {};
        setUserInfo({ ...jwtPayload, ...data });
        setTokenValid(true);
      } catch (err) {
        console.error('Error al verificar token:', err);
        const jwtPayload = parseJwtPayload(token);
        if (jwtPayload) {
          setUserInfo(jwtPayload);
        }
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

  // Determine user role
  const rawRole = (userInfo?.rol || userInfo?.role || userInfo?.tipo_usuario || '').toUpperCase();
  const isDriver = rawRole.includes('CONDUCTOR') || rawRole.includes('DRIVER');
  const isClient = rawRole.includes('CLIENT') || (!rawRole.includes('ADMIN') && !isDriver);
  const isAdmin = rawRole.includes('ADMIN') || rawRole.includes('SUPER');

  const roleBadgeLabel = isDriver
    ? 'CONDUCTOR'
    : isAdmin
    ? 'ADMINISTRADOR'
    : 'CLIENTE';

  const userDisplayName = userInfo?.nombre_completo || userInfo?.nombre || userInfo?.name || '';
  const userEmail = userInfo?.correo || userInfo?.email || '';

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 25%, #154e63 0%, #0d3242 45%, #051c27 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      <div
        className="w-full max-w-[460px] bg-white rounded-[24px] shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-300"
        style={{
          boxShadow: '0 24px 60px rgba(1, 37, 56, 0.45), 0 8px 24px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Badge superior */}
        <div className="flex justify-center mb-4">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-[#ea580c] bg-[#fff7ed] border border-[#ffedd5]"
          >
            Mi Conductor · Activación de {roleBadgeLabel}
          </span>
        </div>

        {/* Verificando estado inicial */}
        {verifying && (
          <div className="py-12 text-center text-sm text-slate-600">
            <div className="inline-block animate-spin w-8 h-8 border-3 border-[#FB9833] border-t-transparent rounded-full mb-3" />
            <p className="font-medium text-slate-700">Verificando enlace de activación...</p>
          </div>
        )}

        {/* Error de token inválido / expirado */}
        {!verifying && !tokenValid && !success && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Enlace no válido</h2>
            <div className="mc-alert-error my-3 text-left">
              {error}
            </div>
            <Link
              to="/login"
              className="inline-block mt-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        )}

        {/* Vista de Éxito (Coincide exactamente con la segunda captura del usuario) */}
        {success && (
          <div className="text-center py-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
              ¡Cuenta Activada!
            </h2>

            {/* Checkmark verde estilizado */}
            <div className="w-14 h-14 bg-[#dcfce7] text-[#16a34a] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              ¡Contraseña guardada exitosamente!
            </h3>

            {(userDisplayName || userEmail) && (
              <p className="text-xs text-slate-500 mb-5">
                {userDisplayName && <>La cuenta de <span className="font-semibold text-slate-700">{userDisplayName}</span><br /></>}
                {userEmail && <span className="text-slate-500">({userEmail})</span>} ya se encuentra activa.
              </p>
            )}

            {/* Si es Conductor o Cliente: Mensaje para continuar en la aplicación móvil */}
            {(isDriver || isClient) && (
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] p-4 rounded-xl text-xs leading-relaxed text-center mb-5">
                Ahora puedes abrir la aplicación móvil <span className="font-bold">Mi Conductor</span> e iniciar sesión como{' '}
                <span className="font-bold">{isDriver ? 'Conductor' : 'Cliente'}</span> con tu correo y tu nueva contraseña.
              </div>
            )}

            {/* Si es Administrador: Botón para ir al inicio de sesión */}
            {isAdmin && (
              <div className="mt-4">
                <div className="bg-[#eff6ff] border border-[#dbeafe] text-[#1e40af] p-3 rounded-xl text-xs leading-relaxed text-center mb-5">
                  Tu acceso administrativo ha sido activado. Ahora puedes iniciar sesión en el panel web.
                </div>
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center py-3 px-4 bg-[#FB9833] hover:bg-[#ea580c] text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
                >
                  Ir al inicio de sesión
                </Link>
              </div>
            )}

            {/* Botón opcional para conductor/cliente si desean regresar */}
            {!isAdmin && (
              <div className="mt-3 text-center">
                <p className="text-[11px] text-slate-400">
                  📱 Continúa en tu celular desde la App Móvil
                </p>
              </div>
            )}
          </div>
        )}

        {/* Formulario para ingresar contraseña inicial */}
        {!verifying && tokenValid && !success && (
          <div>
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Configura tu contraseña
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {userDisplayName
                  ? `Hola ${userDisplayName}, establece tu contraseña para activar tu acceso.`
                  : 'Ingresa tu nueva contraseña para activar tu acceso.'}
              </p>
            </div>

            {error && (
              <div className="mc-alert-error mb-4">
                {error}
              </div>
            )}

            {userEmail && (
              <div className="bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-slate-600 mb-4 flex items-center justify-between">
                <span className="font-medium text-slate-500">Correo asignado:</span>
                <span className="font-bold text-slate-800">{userEmail}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FB9833]/30 focus:border-[#FB9833] transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FB9833]/30 focus:border-[#FB9833] transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label="Mostrar u ocultar confirmación de contraseña"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#FB9833] hover:bg-[#ea580c] text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Activando cuenta...' : 'Activar cuenta y guardar contraseña'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
