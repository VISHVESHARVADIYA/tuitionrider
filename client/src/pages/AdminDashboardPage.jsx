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
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchDiagnostics, setMatchDiagnostics] = useState(null);
  const [contractedMatches, setContractedMatches] = useState([]);
  const [showContracted, setShowContracted] = useState(false);
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

  const fetchMatches = async () => {
    try {
      setLoadingMatches(true);
      const response = await api.get("/admin/matches");
      setSuggestions(response.data.suggestions || []);
      setMatchDiagnostics(response.data.diagnostics || null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load match suggestions.");
    } finally {
      setLoadingMatches(false);
    }
  };

  const sendMatch = async (studentId, tutorId) => {
    try {
      await api.post("/admin/match", { studentId, tutorId });
      toast.success("Match confirmed and sent to both profiles.");
      fetchRecords();
      fetchMatches();
      if (showContracted) {
        fetchContractedMatches();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send match.");
    }
  };

  const fetchContractedMatches = async () => {
    try {
      setLoadingMatches(true);
      const response = await api.get("/admin/contracted");
      setContractedMatches(response.data.matches || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load contracted matches.");
    } finally {
      setLoadingMatches(false);
    }
  };

  const toggleContractedView = async () => {
    if (showContracted) {
      setShowContracted(false);
      return;
    }
    await fetchContractedMatches();
    setShowContracted(true);
  };

  const cancelContract = async (type, id) => {
    try {
      await api.patch(`/admin/${type}/${id}/cancel`);
      toast.success("Contract cancelled successfully.");
      fetchRecords();
      fetchMatches();
      if (showContracted) {
        fetchContractedMatches();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to cancel contract.");
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchMatches();
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
      <section className="section-shell py-10 px-4 md:px-6 lg:px-10">
        <div className="space-y-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                <UsersRound size={16} />
                Admin dashboard
              </p>
              <h1 className="mt-4 text-4xl font-bold text-brand-900">Manage tutor and student requests</h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Review incoming requests, overview AI match suggestions, and confirm the most relevant tutor-student connections from a single full-page layout.
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="pill-button h-fit rounded-full border border-brand-100 bg-white px-5 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-3">
                {Object.entries(tabMap).map(([key, tab]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                      activeTab === key
                        ? "bg-brand-700 text-white shadow-playful"
                        : "bg-brand-50 text-slate-600"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-[280px]">
                  <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition ${ search ? "opacity-0" : "opacity-100 text-slate-400"}`} size={18} />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={search ? "" : ""}
                    className="input-field w-full pl-14"
                  />
                </div>
                <select
                  className="input-field w-full sm:w-[180px]"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="all">All requests</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-3xl text-sm text-slate-600">
                Search by student or tutor name, email, subject, or time slot. AI matches appear below the filters.
              </p>
              <button
                type="button"
                onClick={toggleContractedView}
                className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800 transition"
              >
                {showContracted ? "Hide" : "Show"} contracted matches
              </button>
            </div>

            <div className="rounded-[2.5rem] border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-slate-50 p-7 shadow-lg">
              <div className="flex items-start justify-between gap-4 border-b border-brand-200 pb-5">
                <div>
                  <p className="text-lg font-bold text-brand-900">AI Match Engine</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Auto-matched pairs based on subjects, budget, and time slot.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchMatches}
                  className="rounded-full bg-brand-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-800"
                >
                  ⟳ Refresh
                </button>
              </div>

              <div className="space-y-4 mt-4">
                {matchDiagnostics ? (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-200 px-3 py-1 font-semibold text-slate-700">
                      Considered: {matchDiagnostics.consideredPairs}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                      Matched: {matchDiagnostics.matchedPairs}
                    </span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700">
                      Budget filtered: {matchDiagnostics.budgetRejected}
                    </span>
                    <span className="rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-700">
                      Subject filtered: {matchDiagnostics.subjectRejected}
                    </span>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 font-semibold text-indigo-700">
                      Slot filtered: {matchDiagnostics.slotRejected}
                    </span>
                    <span className="rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-700">
                      Conflict filtered: {matchDiagnostics.conflictRejected}
                    </span>
                  </div>
                ) : null}

                {loadingMatches ? (
                  <div className="py-4">
                    <Loader label="Computing matches..." />
                  </div>
                ) : suggestions.length ? (
                  suggestions.slice(0, 4).map((suggestion) => (
                    <div
                      key={`${suggestion.student._id}-${suggestion.tutor._id}`}
                      className="rounded-2xl border-2 border-brand-300 bg-white p-5 shadow-md hover:shadow-lg transition"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl bg-blue-50 p-3">
                            <p className="font-bold text-brand-900">{suggestion.student.name}</p>
                            <p className="text-xs text-slate-600 mt-2">{suggestion.student.email}</p>
                            <p className="text-xs font-semibold text-blue-700 mt-1">Budget: Rs. {suggestion.student.budget}</p>
                            <p className="text-xs text-slate-600 mt-1">Slot: {suggestion.student.timeSlot}</p>
                          </div>
                          <div className="rounded-xl bg-green-50 p-3">
                            <p className="font-bold text-brand-900">{suggestion.tutor.name}</p>
                            <p className="text-xs text-slate-600 mt-2">{suggestion.tutor.email}</p>
                            <p className="text-xs font-semibold text-green-700 mt-1">Fees: Rs. {suggestion.tutor.fees}</p>
                            <p className="text-xs text-slate-600 mt-1">Slot: {suggestion.tutor.timeSlot}</p>
                          </div>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-3 text-xs text-slate-700">
                          <p className="font-semibold">✓ Matched subjects: {suggestion.subjects.join(", ")}</p>
                          <p className="mt-1 text-slate-600">Qualification: {suggestion.tutor.qualification}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">Budget ✓</span>
                            <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">Subject ✓</span>
                            <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">Slot ✓</span>
                            <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">No Conflict ✓</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-2 text-xs font-bold text-white">
                            Score {suggestion.score}%
                          </span>
                          <button
                            type="button"
                            onClick={() => sendMatch(suggestion.student._id, suggestion.tutor._id)}
                            className="rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-2 text-sm font-bold text-white shadow-md hover:shadow-lg transition"
                          >
                            ✓ Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No match suggestions are available right now.</p>
                )}
              </div>
            </div>

            {showContracted && (
              <div className="rounded-[2.5rem] border-2 border-indigo-200 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">Contracted matches</p>
                    <p className="text-sm text-slate-600">All active tutor-student matches with subjects and time slots.</p>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {contractedMatches.length ? (
                    contractedMatches.map((match) => (
                      <div key={match.student.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Student: {match.student.name}</p>
                            <p className="text-sm text-slate-600">Email: {match.student.email}</p>
                            <p className="text-sm text-slate-600">Class: {match.student.class}</p>
                            <p className="text-sm text-slate-600">Budget: Rs. {match.student.budget}/hr</p>
                            <p className="text-sm text-slate-600">Slot: {match.student.timeSlot}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Tutor: {match.tutor.name}</p>
                            <p className="text-sm text-slate-600">Email: {match.tutor.email}</p>
                            <p className="text-sm text-slate-600">Qualifications: {match.tutor.qualification}</p>
                            <p className="text-sm text-slate-600">Fees: Rs. {match.tutor.fees}/hr</p>
                            <p className="text-sm text-slate-600">Slot: {match.tutor.timeSlot}</p>
                          </div>
                        </div>
                        <div className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-700">
                          <p className="font-semibold">Subjects:</p>
                          <p>{match.student.subjects.join(", ")}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => cancelContract("student", match.student.id)}
                            className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-200 transition"
                          >
                            Resign Student Contract
                          </button>
                          {match.tutor?.id ? (
                            <button
                              type="button"
                              onClick={() => cancelContract("tutor", match.tutor.id)}
                              className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-800 hover:bg-red-200 transition"
                            >
                              Resign Tutor Contracts
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No contracted matches available yet.</p>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-[2.5rem] border-2 border-slate-300 bg-white p-7 shadow-lg">
              {loading ? (
                <div className="p-6 text-center">
                  <Loader label="Loading requests..." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-gradient-to-r from-brand-50 to-slate-50 text-brand-900">
                      <tr>
                        <th className="px-6 py-4 font-bold">Name</th>
                        <th className="px-6 py-4 font-bold">Contact</th>
                        <th className="px-6 py-4 font-bold">Details</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.length ? (
                        filteredRecords.map((record) => (
                          <tr key={record._id} className="border-t-2 border-slate-200 align-top hover:bg-slate-50 transition">
                            <td className="px-6 py-5 font-bold text-slate-900">{record.name}</td>
                            <td className="px-6 py-5 text-slate-700">
                              <p className="font-medium">{record.email}</p>
                              <p className="text-xs text-slate-500 mt-1">{record.phone || record.parentContact}</p>
                              <p className="text-xs text-slate-500 mt-1">Slot: {record.timeSlot}</p>
                            </td>
                            <td className="px-6 py-5 text-slate-700 text-sm">
                              {activeTab === "tutors" ? (
                                <>
                                  <p><span className="font-semibold">Qual:</span> {record.qualification}</p>
                                  <p><span className="font-semibold">Subjects:</span> {record.subjects.join(", ")}</p>
                                  <p><span className="font-semibold">Fees:</span> Rs. {record.fees}/hr</p>
                                </>
                              ) : (
                                <>
                                  <p><span className="font-semibold">Class:</span> {record.class}</p>
                                  <p><span className="font-semibold">Budget:</span> Rs. {record.budget}/hr</p>
                                  <p><span className="font-semibold">Subjects:</span> {record.subjects.join(", ")}</p>
                                </>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`rounded-full px-4 py-2 text-xs font-bold ${
                                  record.contacted
                                    ? "bg-green-100 text-green-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {record.contacted ? "✓ Contacted" : "⏳ Pending"}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => markContacted(activeTab.slice(0, -1), record._id)}
                                  className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-200 transition"
                                >
                                  ☑ Mark
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteRecord(activeTab.slice(0, -1), record._id)}
                                  className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-800 hover:bg-red-200 transition"
                                >
                                  🗑 Delete
                                </button>
                                {(activeTab === "students" ? record.matchStatus === "contracted" : record.matchedStudents?.length > 0) && (
                                  <button
                                    type="button"
                                    onClick={() => cancelContract(activeTab.slice(0, -1), record._id)}
                                    className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-200 transition"
                                  >
                                    ✕ Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-slate-600 font-medium">
                            No requests found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default AdminDashboardPage;
