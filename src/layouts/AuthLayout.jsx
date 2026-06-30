import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
	return (
		<div
			style={{
				minHeight: '100vh',
				background:
					'radial-gradient(circle at 78% 18%, rgba(255, 255, 255, 0.08) 0, rgba(255, 255, 255, 0.03) 18%, transparent 38%), linear-gradient(135deg, #081f2d 0%, #071a27 48%, #081824 100%)',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<div
				aria-hidden="true"
				style={{
					position: 'absolute',
					inset: 'auto -12% 10% auto',
					width: 420,
					height: 420,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 36%, transparent 72%)',
					filter: 'blur(12px)',
					opacity: 0.8,
				}}
			/>
			<div
				style={{
					position: 'relative',
					zIndex: 1,
					minHeight: '100vh',
					display: 'grid',
					placeItems: 'center',
					padding: 24,
					boxSizing: 'border-box',
				}}
			>
				<Outlet />
			</div>
		</div>
	)
}
