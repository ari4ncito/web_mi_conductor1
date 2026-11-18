import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

const Login = lazy(() => import("../modules/auth/pages/Login.jsx"));
const CrearCuenta = lazy(() => import("../modules/auth/pages/CrearCuenta.jsx"));
const RecoverPassword = lazy(() => import("../modules/auth/pages/RecoverPassword.jsx"));
const ResetPassword = lazy(() => import("../modules/auth/pages/ResetPassword.jsx"));
const ActivarCuenta = lazy(() => import("../modules/auth/pages/ActivarCuenta.jsx"));

const DashboardPage = lazy(() => import("../modules/dashboard/pages/DashboardPage.jsx"));
const DriversPage = lazy(() => import("../modules/drivers/pages/DriversPage.jsx"));
const DriverFormPage = lazy(() => import("../modules/drivers/pages/DriverFormPage.jsx"));
const IncidentManagementPage = lazy(() => import("../modules/incidents/pages/IncidentManagementPage.jsx"));
const ServiceRequestsShell = lazy(() => import("../modules/serviceRequests/pages/ServiceRequestsShell.jsx"));
const TrackingPage = lazy(() => import("../modules/tracking/pages/TrackingPage.jsx"));
const UsersPage = lazy(() => import("../modules/users/pages/UsersPage.jsx"));
const VehiclesPage = lazy(() => import("../modules/vehicles/pages/VehiclesPage.jsx"));
const VehicleFormPage = lazy(() => import("../modules/vehicles/pages/VehicleFormPage.jsx"));
const RolesPage = lazy(() => import("../modules/roles/pages/roles.jsx"));
const RoleFormPage = lazy(() => import("../modules/roles/pages/RoleFormPage.jsx"));
const AdminProfilePage = lazy(() => import("../modules/profile/pages/AdminProfilePage.jsx"));

const ClientsShell = lazy(() => import("../modules/clients/pages/ClientsShell.jsx"));

const PrincipalPage = lazy(() => import("../modules/principalPage/page/PrincipalPage.jsx"));

export default function AppRoutes() {

    return (
        <BrowserRouter>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Cargando...</div>}>
                <Routes>

                    {/* ================================= */}
                    {/* PÁGINA PRINCIPAL - PÚBLICA        */}
                    {/* ================================= */}

                    <Route
                        path="/"
                        element={<PrincipalPage />}
                    />


                    {/* ================================= */}
                    {/* RUTAS PÚBLICAS DE AUTENTICACIÓN  */}
                    {/* ================================= */}

                    <Route element={<PublicRoute />}>

                        <Route element={<AuthLayout />}>

                            <Route
                                path="/login"
                                element={<Login />}
                            />

                            <Route
                                path="/register"
                                element={<CrearCuenta />}
                            />

                            <Route
                                path="/recover-password"
                                element={<RecoverPassword />}
                            />

                            <Route
                                path="/reset-password"
                                element={<ResetPassword />}
                            />

                            <Route
                                path="/activar-cuenta"
                                element={<ActivarCuenta />}
                            />

                        </Route>

                    </Route>


                    {/* ================================= */}
                    {/* RUTAS PROTEGIDAS                  */}
                    {/* ================================= */}

                    <Route element={<ProtectedRoute />}>

                        <Route element={<AdminLayout />}>

                            <Route
                                path="/dashboard"
                                element={<DashboardPage />}
                            />

                            <Route
                                path="/profile"
                                element={<AdminProfilePage />}
                            />

                            {/* Sub-rutas protegidas por permisos específicos */}
                            <Route element={<ProtectedRoute requiredPermission={["ver.roles", "crear.roles", "editar.roles", "eliminar.roles"]} />}>
                                <Route
                                    path="/roles"
                                    element={<RolesPage />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission="ver.roles" />}>
                                <Route
                                    path="/roles/:id"
                                    element={<RoleFormPage mode="detail" />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission="crear.roles" />}>
                                <Route
                                    path="/roles/new"
                                    element={<RoleFormPage mode="create" />}
                                />
                                <Route
                                    path="/roles/register"
                                    element={<RoleFormPage mode="create" />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission="editar.roles" />}>
                                <Route
                                    path="/roles/:id/edit"
                                    element={<RoleFormPage mode="edit" />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission={["ver.usuarios", "crear.usuarios", "editar.usuarios", "eliminar.usuarios"]} />}>
                                <Route
                                    path="/users"
                                    element={<UsersPage />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission={["ver.clientes", "crear.clientes", "editar.clientes", "eliminar.clientes"]} />}>
                                <Route
                                    path="/clients/*"
                                    element={<ClientsShell />}
                                />
                            </Route>

                            {/* ================================= */}
                            {/* RUTAS DEL MÓDULO DE CONDUCTORES   */}
                            {/* ================================= */}

                            <Route element={<ProtectedRoute requiredPermission={["ver.conductores", "crear.conductores", "editar.conductores", "eliminar.conductores"]} />}>
                                <Route
                                    path="/drivers"
                                    element={<DriversPage />}
                                />
                                <Route
                                    path="/drivers/:id"
                                    element={<DriverFormPage mode="detail" />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission="crear.conductores" />}>
                                <Route
                                    path="/drivers/new"
                                    element={<DriverFormPage mode="create" />}
                                />
                                <Route
                                    path="/drivers/register"
                                    element={<DriverFormPage mode="create" />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission="editar.conductores" />}>
                                <Route
                                    path="/drivers/:id/edit"
                                    element={<DriverFormPage mode="edit" />}
                                />
                            </Route>

                            {/* ================================= */}
                            {/* RUTAS DEL MÓDULO DE VEHÍCULOS     */}
                            {/* ================================= */}

                            <Route element={<ProtectedRoute requiredPermission={["ver.vehiculos", "crear.vehiculos", "editar.vehiculos", "eliminar.vehiculos"]} />}>
                                <Route
                                    path="/vehicles"
                                    element={<VehiclesPage />}
                                />
                                <Route
                                    path="/vehicles/:id"
                                    element={<VehicleFormPage mode="detail" />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission="crear.vehiculos" />}>
                                <Route
                                    path="/vehicles/new"
                                    element={<VehicleFormPage mode="create" />}
                                />
                                <Route
                                    path="/vehicles/register"
                                    element={<VehicleFormPage mode="create" />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission="editar.vehiculos" />}>
                                <Route
                                    path="/vehicles/:id/edit"
                                    element={<VehicleFormPage mode="edit" />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission={["ver.solicitudes", "crear.solicitudes", "asignar.solicitudes", "ruta.solicitudes", "cancelar.solicitudes", "detalles.solicitudes"]} />}>
                                <Route
                                    path="/service-requests/*"
                                    element={<ServiceRequestsShell />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission={["ruta.solicitudes", "ver.solicitudes"]} />}>
                                <Route
                                    path="/tracking"
                                    element={<TrackingPage />}
                                />
                            </Route>

                            <Route element={<ProtectedRoute requiredPermission={["ver.novedades", "crear.novedades", "editar.novedades", "eliminar.novedades"]} />}>
                                <Route
                                    path="/incidents"
                                    element={<IncidentManagementPage />}
                                />
                            </Route>

                        </Route>

                    </Route>


                    {/* ================================= */}
                    {/* RUTA NO ENCONTRADA                */}
                    {/* ================================= */}

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />

                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
