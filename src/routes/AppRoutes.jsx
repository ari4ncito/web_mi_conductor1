import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ClientsShell from '../modules/clients/pages/ClientsShell.jsx'

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/clients" replace />} />
				<Route path="/clients/*" element={<ClientsShell />} />
			</Routes>
		</BrowserRouter>
	)
}
