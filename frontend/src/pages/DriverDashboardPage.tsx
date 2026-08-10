import React, { useEffect, useState } from 'react';
import { getMyVolunteerTasks, updateVolunteerTaskStatus } from '../api/volunteerApi';
import { VolunteerTask } from '../types';
import { useToast } from '../context/ToastContext';
import { Truck, CheckCircle2, MapPin, Calendar, Clock, RefreshCw } from 'lucide-react';

export const DriverDashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getMyVolunteerTasks();
      setTasks(data);
    } catch {
      showToast('Failed to load volunteer tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId: string, status: VolunteerTask['status']) => {
    try {
      const updated = await updateVolunteerTaskStatus(taskId, status);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      showToast(`Task updated to ${status}`, 'success');
    } catch {
      showToast('Failed to update task status', 'error');
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Truck className="w-8 h-8 text-amber-400" />
            Volunteer Driver Logistics Console
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Dispatch console for volunteer drivers to manage item collection and warehouse transit
          </p>
        </div>

        <button
          onClick={fetchTasks}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700 self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800 text-slate-400 text-sm">
          Loading assigned dispatch routes...
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800 space-y-3">
          <Truck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-slate-300 font-semibold text-base">No active pickup assignments</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            You are ready to claim available donor pickup requests assigned by NGO partners.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    Category: {task.donation.category}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                    STATUS: {task.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  Destination NGO: {task.donation.ngo?.name}
                </h3>
                <p className="text-xs text-slate-300 mb-3">{task.donation.description || 'Standard packaged donation.'}</p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span><strong>NGO Hub:</strong> {task.donation.ngo?.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span><strong>Pickup Date:</strong> {task.donation.pickupDate || 'Flexible'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span><strong>Dispatch Route Note:</strong> {task.routeNotes}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(task.id, 'IN_TRANSIT')}
                  disabled={task.status === 'IN_TRANSIT'}
                  className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-bold transition-all"
                >
                  🚚 Mark In-Transit
                </button>
                <button
                  onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                  disabled={task.status === 'COMPLETED'}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Completed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
