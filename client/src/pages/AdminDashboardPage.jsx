import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, CheckCircle2, LogOut, UsersRound } from "lucide-react";
import PageShell from "../components/PageShell";
import Loader from "../components/Loader";
import { api } from "../config/api";
import { useAuth } from "../context/AuthContext";

const tabMap = {
  tutors: {
    title: "Tutor Requests",
  },
  students: {
    title: "Student Requests",
  },
};

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("tutors");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [records, setRecords] = useState({ tutors: [], students: [] });
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const [tutors, students] = await Promise.all([
        api.get("/admin/tutors"),
        api.get("/admin/students"),
      ]);

      setRecords({
        tutors: tutors.data.requests,
        students: students.data.requests,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    return records[activeTab].filter((record) => {
      const haystack = `${record.name} ${record.email} ${record.phone || ""} ${
        record.parentContact || ""
      } ${Array.isArray(record.subjects) ? record.subjects.join(" ") : ""} ${
        record.qualification || ""
      } ${record.class || ""}`.toLowerCase();

      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "contacted"
          ? record.contacted
          : !record.contacted;

      return matchesSearch && matchesStatus;
    });
  }, [activeTab, records, search, statusFilter]);

  const markContacted = async (type, id) => {
    try {
      await api.patch(`/admin/${type}/${id}/contacted`);
      toast.success("Marked as contacted.");
      fetchRecords();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update request.");
    }
  };

  const deleteRecord = async (type, id) => {
    try {
      await api.delete(`/admin/${type}/${id}`);
      toast.success("Request deleted.");
      fetchRecords();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete request.");
    }
  };

  return (
    <PageShell>
      <section className="section-shell py-10">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                <UsersRound size={16} />
                Protected admin dashboard
              </p>
              <h1 className="mt-4 text-3xl font-bold text-brand-900">Manage requests with ease</h1>
              <p className="mt-2 text-sm text-slate-600">
                Review incoming tutor and student requests, then filter, search, and follow up.
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="pill-button border border-brand-100 bg-white text-brand-700 hover:bg-brand-50"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {Object.entries(tabMap).map(([key, tab]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    activeTab === key
                      ? "bg-brand-700 text-white shadow-playful"
                      : "bg-brand-50 text-slate-600"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  className="input-field pl-11"
                  placeholder="Search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <select
                className="input-field"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All requests</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
              </select>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-brand-100 bg-white">
            {loading ? (
              <div className="p-6">
                <Loader label="Loading dashboard data..." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-brand-50 text-brand-800">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Name</th>
                      <th className="px-5 py-4 font-semibold">Contact</th>
                      <th className="px-5 py-4 font-semibold">Details</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length ? (
                      filteredRecords.map((record) => (
                        <tr key={record._id} className="border-t border-slate-100 align-top">
                          <td className="px-5 py-4 font-semibold text-slate-800">{record.name}</td>
                          <td className="px-5 py-4 text-slate-600">
                            <p>{record.email}</p>
                            <p>{record.phone || record.parentContact}</p>
                          </td>
                          <td className="px-5 py-4 text-slate-600">
                            {activeTab === "tutors" ? (
                              <>
                                <p>Qualification: {record.qualification}</p>
                                <p>Subjects: {record.subjects.join(", ")}</p>
                                <p>Fees: Rs. {record.fees}/hr</p>
                              </>
                            ) : (
                              <>
                                <p>Class: {record.class}</p>
                                <p>Budget: Rs. {record.budget}/hr</p>
                              </>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                                record.contacted
                                  ? "bg-mint text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {record.contacted ? "Contacted" : "Pending"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => markContacted(activeTab.slice(0, -1), record._id)}
                                className="rounded-full bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700"
                              >
                                <CheckCircle2 size={14} className="mr-1 inline-block" />
                                Mark contacted
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteRecord(activeTab.slice(0, -1), record._id)}
                                className="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700"
                              >
                                <Trash2 size={14} className="mr-1 inline-block" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-5 py-8 text-center text-slate-500">
                          No matching requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default AdminDashboardPage;
