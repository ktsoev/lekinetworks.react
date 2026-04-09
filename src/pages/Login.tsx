import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { isValidEmail } from '../utils/validators'
import styles from './Login.module.css'

export function Login() {
	const { isAuthenticated, sendCode } = useAuth()
	const { toast } = useToast()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const location = useLocation()
	const from = (location.state as { from?: string })?.from ?? '/dashboard'

	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	if (isAuthenticated) return <Navigate to={from} replace />

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!isValidEmail(email)) {
			setError(t('auth.login.emailError'))
			return
		}
		setError('')
		setLoading(true)
		try {
			await sendCode(email)
			toast(t('auth.login.codeSent'), 'success')
			navigate('/auth/verify')
		} catch {
			toast(t('auth.login.sendFailed'), 'error')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<h1 className={styles.heading}>{t('auth.login.heading')}</h1>
			<p className={styles.sub}>{t('auth.login.sub')}</p>
			<form className={styles.form} onSubmit={handleSubmit}>
				<Input
					label={t('auth.login.emailLabel')}
					type='email'
					placeholder={t('auth.login.emailPlaceholder')}
					value={email}
					onChange={e => {
						setEmail(e.target.value)
						setError('')
					}}
					error={error}
					autoComplete='email'
					autoFocus
				/>
				<Button
					type='submit'
					full
					loading={loading}
					disabled={!email.trim() || loading}
				>
					{t('auth.login.submit')}
				</Button>
			</form>
			<Link to='/' className={styles.backLink}>
				{t('common.nav.backToHome')}
			</Link>
		</>
	)
}
