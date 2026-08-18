import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { ArrowLeft, Mail, Lock, User as UserIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeSlideUp, fadeOnly, staggerContainer } from '../lib/motionVariants'
import { useMotionVariants } from '../lib/motionVariants'

type Mode = 'signin' | 'signup'
type OAuthProvider = 'google' | 'github' | 'azure' | 'linkedin_oidc'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 1C5.92 1 1 5.92 1 12c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53v-1.86c-3.06.67-3.71-1.47-3.71-1.47-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.47-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.22-2.57 5.15-5.02 5.42.4.34.74 1 .74 2.02v3c0 .29.2.64.76.53A11 11 0 0 0 23 12c0-6.08-4.92-11-11-11z" />
    </svg>
  )
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#F25022" d="M3 3h8.5v8.5H3z" />
      <path fill="#7FBA00" d="M12.5 3H21v8.5h-8.5z" />
      <path fill="#00A4EF" d="M3 12.5h8.5V21H3z" />
      <path fill="#FFB900" d="M12.5 12.5H21V21h-8.5z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

const OAUTH_PROVIDERS: { provider: OAuthProvider; label: string; Icon: (p: { className?: string }) => JSX.Element }[] = [
  { provider: 'google', label: 'Continue with Google', Icon: GoogleIcon },
  { provider: 'github', label: 'Continue with GitHub', Icon: GitHubIcon },
  { provider: 'azure', label: 'Continue with Microsoft', Icon: MicrosoftIcon },
  { provider: 'linkedin_oidc', label: 'Continue with LinkedIn', Icon: LinkedInIcon },
]

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const navigate = useNavigate()
  const { fadeSlideUp: fsu, staggerContainer: stagger, fadeOnly: fo } = useMotionVariants()

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    if (oauthLoading) return
    setOauthLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` },
      })
      if (error) throw error
    } catch (err: any) {
      toast.error(err.message || 'OAuth sign-in failed.')
      setOauthLoading(null)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      if (mode === 'signup') {
        if (password.length < 6) throw new Error('Password must be at least 6 characters.')
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name || undefined } },
        })
        if (error) throw error
        if (data.user && !data.session) {
          toast.success('Account created. Please sign in.')
          setMode('signin')
          setPassword('')
          return
        }
        toast.success('Welcome to VersaCareer AI!')
        navigate('/dashboard')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Signed in.')
        navigate('/dashboard')
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="px-4 md:px-8 h-16 flex items-center">
        <Link to="/" className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Back</Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div initial="hidden" animate="visible" variants={fo} className="w-full max-w-md">
          <motion.div variants={fsu} className="text-center mb-8">
            <img src="/VersaCareer_AI_Logo.png" alt="" className="h-14 w-14 rounded-[3px] mx-auto mb-4" />
            <h1 className="text-2xl font-semibold">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
            <p className="text-text-muted text-sm mt-1">
              {mode === 'signup' ? 'Start your career intelligence journey.' : 'Sign in to continue.'}
            </p>
          </motion.div>

          <motion.div variants={stagger(60)} className="space-y-2.5 mb-4">
            {OAUTH_PROVIDERS.map(({ provider, label, Icon }) => (
              <motion.button
                key={provider}
                variants={fsu}
                type="button"
                onClick={() => handleOAuthLogin(provider)}
                disabled={oauthLoading !== null}
                className="btn-ghost w-full flex items-center justify-center gap-3 py-2.5 border border-border bg-brand-card hover:bg-brand-card/80 transition-colors disabled:opacity-50"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{oauthLoading === provider ? 'Redirecting…' : label}</span>
              </motion.button>
            ))}
          </motion.div>

          <motion.div variants={fsu} className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-text-faint uppercase tracking-wider">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </motion.div>

          <motion.form variants={fsu} onSubmit={submit} className="card p-6 space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="label">Full name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
                  <input className="input pl-10" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
                <input type="email" required className="input pl-10" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
                <input type="password" required className="input pl-10" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </motion.form>

          <motion.p variants={fsu} className="text-center text-sm text-text-muted mt-5">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
              className="text-primary hover:underline font-medium"
            >
              {mode === 'signup' ? 'Sign in' : 'Sign up'}
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
