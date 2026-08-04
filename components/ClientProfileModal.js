'use client';
import { useEffect, useState } from 'react';
import { Phone, Globe, Users as UsersIcon, Calendar, Pencil } from 'lucide-react';
import Modal from './Modal';
import { formatDateTime } from '@/lib/format';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-600',
  confirmed: 'bg-brand-50 text-brand-600',
  completed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-rose-50 text-rose-600',
};

export default function ClientProfileModal({ client, onClose, onEdit }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!client) return;
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ client: client['client name'], all: 'true', sort: 'desc' });
    fetch(`/api/appointments?${params}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed to load appointment history');
        setAppointments(data.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [client]);

  if (!client) return null;

  const completedCount = appointments.filter((a) => (a.status || '').toLowerCase() === 'completed').length;

  return (
    <Modal title="Client Profile" onClose={onClose} wide>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{client['client name']}</h3>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${client.status?.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
              {client.status}
            </span>
          </div>
          {onEdit && (
            <button
              onClick={() => onEdit(client)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              <Pencil size={13} /> Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoItem icon={Phone} label="Phone" value={client.phone} />
          <InfoItem icon={UsersIcon} label="Gender" value={client.gender} />
          <InfoItem icon={Globe} label="Language" value={client.language} />
          <InfoItem icon={Calendar} label="Registered" value={client['created at'] ? formatDateTime(client['created at']) : '—'} />
          <InfoItem label="Platform" value={client.platform} />
          <InfoItem label="Total Appointments" value={appointments.length} />
          <InfoItem label="Completed" value={completedCount} />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Appointment History</h4>
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-sm">
                <thead className="sticky top-0">
                  <tr className="text-left text-slate-500 bg-slate-50 border-b border-slate-100">
                    <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Treatment</th>
                    <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Date</th>
                    <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Time</th>
                    <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Platform</th>
                    <th className="px-3 py-2 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-6 text-slate-400">Loading...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={5} className="text-center py-6 text-rose-500">{error}</td></tr>
                  ) : appointments.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-6 text-slate-400">No appointments yet</td></tr>
                  ) : (
                    appointments.map((a) => (
                      <tr key={a.ID} className="border-b border-slate-50 last:border-0">
                        <td className="px-3 py-2 whitespace-nowrap">{a['treatment name'] || '—'}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{a['preferred date'] ? new Date(a['preferred date']).toLocaleDateString() : '—'}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{a['preferred time'] || '—'}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{a.platform || '—'}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[a.status?.toLowerCase()] || 'bg-slate-100 text-slate-500'}`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50">Close</button>
        </div>
      </div>
    </Modal>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
        {Icon && <Icon size={12} />} {label}
      </div>
      <p className="text-sm font-semibold text-slate-700 truncate">{value || '—'}</p>
    </div>
  );
}
