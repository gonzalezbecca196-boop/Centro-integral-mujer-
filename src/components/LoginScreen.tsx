import React, { useState } from 'react';
import { MapPin, Mail, Lock, Eye, EyeOff, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import { loginWithGoogle } from '../firebase';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onSkipToApp: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onSkipToApp,
}) => {
  const [email, setEmail] = useState('maria.gonzalez@ejemplo.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 400);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setLoginError(null);
    try {
      const user = await loginWithGoogle();
      if (user) {
        onLoginSuccess();
      }
      // If user is null, the user cancelled or closed the popup gracefully
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        // User voluntarily dismissed the popup, no error needed
        return;
      }
      if (err?.code === 'auth/popup-blocked') {
        setLoginError(
          'La ventana emergente fue bloqueada por el navegador. Por favor permite las ventanas emergentes para continuar.'
        );
        return;
      }
      setLoginError(
        'No se pudo completar el inicio con Google en este momento. Puedes ingresar normalmente con el formulario o acceder como invitada.'
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[#fbf9fe] flex flex-col justify-between p-5 animate-in fade-in duration-200">
      {/* Top Bar with Back Arrow & Title */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onSkipToApp}
          className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 shadow-xs"
          aria-label="Volver"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="font-bold text-slate-800 text-sm">Iniciar sesión</h2>
        <div className="w-9" />
      </div>

      {/* Main Login Card */}
      <div className="max-w-sm w-full mx-auto my-auto py-4 space-y-6">
        {/* Brand Icon Banner (matching video frame 00:02) */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-700 to-fuchsia-600 text-white flex items-center justify-center mx-auto shadow-md shadow-purple-400/30">
            <div className="relative">
              <MapPin className="w-9 h-9 fill-white" />
              <div className="absolute -bottom-1.5 left-1 w-6 h-1 bg-amber-300 rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-purple-950 tracking-tight">
            CIM Mugica
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Bienvenida a tu comunidad
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Correo electrónico o usuario */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type="text"
                id="login-input-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico o usuario"
                className="w-full px-4 py-3 pl-11 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none shadow-xs"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-input-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-3 pl-11 pr-11 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none shadow-xs"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 absolute right-2 top-2"
                aria-label="Mostrar contraseña"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Recordarme & Olvidaste */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
              />
              <span>Recordarme</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setRecoverySent(true);
                setTimeout(() => setRecoverySent(false), 4000);
              }}
              className="text-purple-700 hover:text-purple-900 font-semibold underline underline-offset-2"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {recoverySent && (
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-800 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Se envió un enlace de recuperación a tu correo registrado.</span>
            </div>
          )}

          {/* Iniciar sesión Button */}
          <button
            id="btn-submit-login"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white font-bold text-sm shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-[#fbf9fe] px-3 text-xs text-slate-400">
            o acceder con
          </span>
        </div>

        {/* Google Authentication Button */}
        <button
          id="btn-login-google"
          type="button"
          disabled={isGoogleLoading}
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
        >
          {isGoogleLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continuar con Google (Firebase)</span>
            </>
          )}
        </button>

        {loginError && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{loginError}</span>
          </div>
        )}

        {/* Crear cuenta link */}
        <div className="text-center text-xs text-slate-600">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onLoginSuccess}
            className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2"
          >
            Crear cuenta
          </button>
        </div>
      </div>

      {/* Neighborhood graphic footer (matching video frame 00:04) */}
      <div className="text-center pt-2">
        <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">
          Community Integrated Management • CIM Mugica
        </span>
      </div>
    </div>
  );
};
