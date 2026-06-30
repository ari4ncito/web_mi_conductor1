import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar/Sidebar.jsx'

export default function AdminLayout() {
	return (
		<div style={{ display: 'flex', minHeight: '100vh', background: '#f3f6fb' }}>
			<Sidebar />
			<main style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
				<Outlet />
			</main>
		</div>
	)
}
