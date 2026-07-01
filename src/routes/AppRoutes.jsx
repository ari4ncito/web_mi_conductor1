import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import ClientsShell from "../modules/clients/pages/ClientsShell.jsx";
import Login from "../modules/auth/pages/Login.jsx";
import CrearCuenta from "../modules/auth/pages/CrearCuenta.jsx";
import RecoverPassword from "../modules/auth/pages/RecoverPassword.jsx";
import DashboardPage from "../modules/dashboard/pages/DashboardPage.jsx";
import DriversPage from "../modules/drivers/pages/DriversPage.jsx";
import IncidentManagementPage from "../modules/incidents/pages/IncidentManagementPage.jsx";
import ServiceRequestsShell from "../modules/serviceRequests/pages/ServiceRequestsShell.jsx";
import TrackingPage from "../modules/tracking/pages/TrackingPage.jsx";
import UsersPage from "../modules/users/pages/UsersPage.jsx";
import VehiclesPage from "../modules/vehicles/pages/VehiclesPage.jsx";
import RolesPage from "../modules/roles/pages/roles.jsx";
import PrincipalPage from "../modules/principalPage/page/PrincipalPage.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CrearCuenta />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/clients/*" element={<ClientsShell />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/service-requests/*" element={<ServiceRequestsShell />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/incidents" element={<IncidentManagementPage />} />
        </Route>
        <Route path="/" element={<PrincipalPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
