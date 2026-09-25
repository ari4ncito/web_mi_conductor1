import { useEffect, useState } from 'react'
import VehiculoService from '../../vehicles/services/VehiculoService.js'

export default function ClientVehiclesModal({ client, onClose }) {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const response = await VehiculoService.getAll()
        let allVehicles = []
        if (Array.isArray(response)) allVehicles = response
        else if (response && Array.isArray(response.data)) allVehicles = response.data
        else if (response && response.data && Array.isArray(response.data.rows)) allVehicles = response.data.rows
        else if (response && Array.isArray(response.rows)) allVehicles = response.rows
        else if (response && Array.isArray(response.vehiculos)) allVehicles = response.vehiculos
        
        const clientId = client._id
        const clientVehicles = allVehicles.filter(v => {
          const vClientId = v.cliente?._id || v.cliente
          return vClientId === clientId
        })
        
        setVehicles(clientVehicles)
      } catch (err) {
        console.error("Error fetching vehicles:", err)
        setError("Error al cargar los vehículos")
      } finally {
        setLoading(false)
      }
    }
    
    if (client) {
      fetchVehicles()
    }
  }, [client])

  const nombreCompleto = `${client?.usuario?.nombre || client?.nombre || ''} ${client?.usuario?.apellido || client?.apellido || ''}`.trim() || 'el cliente'

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 24,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 600,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
      }}>
        {/* HEADER */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(27, 46, 61, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: '#1e293b' }}>
              Vehículos de {nombreCompleto}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#667085' }}>
              Lista de vehículos asignados a este cliente
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              border: 'none',
              background: '#f1f5f9',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: 32, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#667085', padding: 40 }}>
              Cargando vehículos...
            </div>
          ) : error ? (
            <div style={{ color: '#be123c', background: '#fff1f2', padding: 16, borderRadius: 12 }}>
              {error}
            </div>
          ) : vehicles.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#667085', padding: 40, background: '#f8fafc', borderRadius: 16 }}>
              Este cliente no tiene vehículos registrados.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {vehicles.map(v => (
                <div key={v._id} style={{
                  border: '1px solid rgba(27, 46, 61, 0.08)',
                  borderRadius: 16,
                  padding: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#fcfcfd'
                }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>
                      {v.placa || 'Sin placa'}
                    </div>
                    <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                      {v.marca || 'Sin marca'} {v.modelo || ''} {v.color ? `- ${v.color}` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: v.estado !== false ? '#dcfce7' : '#fee2e2',
                      color: v.estado !== false ? '#166534' : '#991b1b'
                    }}>
                      {v.estado !== false ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* FOOTER */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid rgba(27, 46, 61, 0.08)',
          textAlign: 'right'
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: '10px 24px',
              borderRadius: 12,
              border: '1px solid rgba(27, 46, 61, 0.15)',
              background: '#ffffff',
              color: '#334155',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
