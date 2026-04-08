import { useEffect, useState } from "react";
import { Edit2, X, Check } from "lucide-react";
import PageShell from "../components/PageShell";
import Loader from "../components/Loader";
import { api } from "../config/api";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/profile");
        setProfileData(response.data);
      } catch (error) {
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatStatus = (record) => {
    if (record.matchStatus === "contracted") {
      return "Contracted";
    }
    if (record.contacted) {
      return "Contacted";
    }
    return "Pending";
  };

  const startEdit = (type, record) => {
    setEditingType(type);
    setEditingId(record._id);
    setEditData({ ...record });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingType(null);
    setEditData({});
  };

  const formatSubjects = (subjects) => {
    if (Array.isArray(subjects)) {
      return subjects.join(", ");
    }
    return subjects;
  };

  const parseTimeSlot = (slot) => {
    if (!slot) return ["", ""];
    const [start, end] = slot.split(" - ").map((part) => part.trim());
    return [start || "", end || ""];
  };

  const timeOptions = Array.from({ length: 33 }, (_, index) => {
    const totalMinutes = 6 * 60 + index * 30;
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const suffix = hours24 >= 12 ? "PM" : "AM";
    const displayHour = hours24 % 12 || 12;
    return `${displayHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  });

  const saveEdit = async () => {
    try {
      setSaving(true);
      const dataToSave = { ...editData };
      if (typeof dataToSave.subjects === "string") {
        dataToSave.subjects = dataToSave.subjects.split(",").map((s) => s.trim());
      }

      const endpoint = editingType === "student" ? `/student/${editingId}` : `/tutor/${editingId}`;
      const response = await api.patch(endpoint, dataToSave);

      if (editingType === "student") {
        setProfileData((prev) => ({
          ...prev,
          studentRequests: prev.studentRequests.map((req) => (req._id === editingId ? response.data.request : req)),
        }));
      } else {
        setProfileData((prev) => ({
          ...prev,
          tutorRequests: prev.tutorRequests.map((req) => (req._id === editingId ? response.data.request : req)),
        }));
      }

      cancelEdit();
    } catch (error) {
      alert("Failed to update profile: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <section className="section-shell py-10">
        <div className="glass-card p-6 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Welcome back</p>
            <h1 className="mt-4 text-3xl font-bold text-brand-900">{user?.name || "Student"}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Here are your requests and matched connections. Click edit to update your details.
            </p>
          </div>

          {loading ? (
            <Loader label="Loading profile..." />
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-brand-900">Your Student Requests</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Any tuition requests submitted with your email address.
                </p>
                <div className="mt-6 space-y-4">
                  {profileData?.studentRequests?.length ? (
                    profileData.studentRequests.map((request) =>
                      editingId === request._id && editingType === "student" ? (
                        <div key={request._id} className="rounded-2xl border-2 border-brand-300 bg-white p-6 shadow-lg">
                          <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Name</label>
                                <input
                                  type="text"
                                  value={editData.name || ""}
                                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                  className="input-field mt-2 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Class</label>
                                <input
                                  type="text"
                                  value={editData.class || ""}
                                  onChange={(e) => setEditData({ ...editData, class: e.target.value })}
                                  className="input-field mt-2 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Budget (Rs/hr)</label>
                                <input
                                  type="number"
                                  value={editData.budget || ""}
                                  onChange={(e) => setEditData({ ...editData, budget: parseFloat(e.target.value) })}
                                  className="input-field mt-2 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Parent Contact</label>
                                <input
                                  type="text"
                                  value={editData.parentContact || ""}
                                  onChange={(e) => setEditData({ ...editData, parentContact: e.target.value })}
                                  className="input-field mt-2 w-full"
                                />
                              </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Subjects</label>
                                <input
                                  type="text"
                                  value={formatSubjects(editData.subjects) || ""}
                                  onChange={(e) => setEditData({ ...editData, subjects: e.target.value })}
                                  className="input-field mt-2 w-full"
                                  placeholder="Math, Science, English"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Time Slot</label>
                                <input
                                  type="text"
                                  value={editData.timeSlot || ""}
                                  onChange={(e) => setEditData({ ...editData, timeSlot: e.target.value })}
                                  className="input-field mt-2 w-full"
                                  placeholder="10:00 AM - 12:00 PM"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700">Email</label>
                              <input
                                type="email"
                                value={editData.email || ""}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                className="input-field mt-2 w-full"
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={saveEdit}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                              >
                                <Check size={18} />
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex items-center gap-2 rounded-lg bg-slate-300 px-5 py-2 font-semibold text-slate-800 hover:bg-slate-400"
                              >
                                <X size={18} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={request._id} className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-md hover:shadow-lg transition">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-brand-900">{request.name}</h3>
                              <p className="text-sm text-slate-500">{request.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                                {formatStatus(request)}
                              </span>
                              {request.matchStatus !== "contracted" && (
                                <button
                                  onClick={() => startEdit("student", request)}
                                  className="rounded-lg bg-brand-100 p-2 text-brand-700 hover:bg-brand-200"
                                >
                                  <Edit2 size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold">Class:</span> {request.class}
                            </p>
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold">Budget:</span> Rs. {request.budget}/hr
                            </p>
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold">Time slot:</span> {request.timeSlot}
                            </p>
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold">Parent:</span> {request.parentContact}
                            </p>
                          </div>
                          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                            <span className="font-semibold">Subjects:</span> {request.subjects.join(", ")}
                          </div>
                          {request.matchStatus === "contracted" && request.matchedTutor ? (
                            <div className="mt-4 rounded-xl border-2 border-green-200 bg-green-50 p-4">
                              <p className="text-sm font-bold text-green-900">✓ Matched Tutor</p>
                              <p className="text-sm font-semibold text-green-800 mt-2">{request.matchedTutor.name}</p>
                              <p className="text-sm text-green-700">Email: {request.matchedTutor.email}</p>
                              <p className="text-sm text-green-700">Phone: {request.matchedTutor.phone}</p>
                              <p className="text-sm text-green-700">Qualification: {request.matchedTutor.qualification}</p>
                              <p className="text-sm text-green-700">Time slot: {request.matchedTutor.timeSlot}</p>
                            </div>
                          ) : null}
                        </div>
                      )
                    )
                  ) : (
                    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 text-sm text-slate-500">
                      No student requests found yet.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-brand-900">Your Tutor Requests</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Any tutor request submitted with your email address.
                </p>
                <div className="mt-6 space-y-4">
                  {profileData?.tutorRequests?.length ? (
                    profileData.tutorRequests.map((request) =>
                      editingId === request._id && editingType === "tutor" ? (
                        <div key={request._id} className="rounded-2xl border-2 border-brand-300 bg-white p-6 shadow-lg">
                          <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Name</label>
                                <input
                                  type="text"
                                  value={editData.name || ""}
                                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                  className="input-field mt-2 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Qualification</label>
                                <input
                                  type="text"
                                  value={editData.qualification || ""}
                                  onChange={(e) => setEditData({ ...editData, qualification: e.target.value })}
                                  className="input-field mt-2 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Fees (Rs/hr)</label>
                                <input
                                  type="number"
                                  value={editData.fees || ""}
                                  onChange={(e) => setEditData({ ...editData, fees: parseFloat(e.target.value) })}
                                  className="input-field mt-2 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Phone</label>
                                <input
                                  type="text"
                                  value={editData.phone || ""}
                                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                  className="input-field mt-2 w-full"
                                />
                              </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Time Slot</label>
                                <div className="grid gap-4 sm:grid-cols-2">
                                  <select
                                    className="input-field mt-2 w-full"
                                    value={parseTimeSlot(editData.timeSlot)[0]}
                                    onChange={(e) => {
                                      const [, end] = parseTimeSlot(editData.timeSlot);
                                      setEditData({ ...editData, timeSlot: `${e.target.value} - ${end}`.trim() });
                                    }}
                                  >
                                    <option value="">Start time</option>
                                    {timeOptions.map((time) => (
                                      <option key={`student-start-${time}`} value={time}>{time}</option>
                                    ))}
                                  </select>
                                  <select
                                    className="input-field mt-2 w-full"
                                    value={parseTimeSlot(editData.timeSlot)[1]}
                                    onChange={(e) => {
                                      const [start] = parseTimeSlot(editData.timeSlot);
                                      setEditData({ ...editData, timeSlot: `${start} - ${e.target.value}`.trim() });
                                    }}
                                  >
                                    <option value="">End time</option>
                                    {timeOptions.map((time) => (
                                      <option key={`student-end-${time}`} value={time}>{time}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Subjects</label>
                                <input
                                  type="text"
                                  value={formatSubjects(editData.subjects) || ""}
                                  onChange={(e) => setEditData({ ...editData, subjects: e.target.value })}
                                  className="input-field mt-2 w-full"
                                  placeholder="Math, Science, English"
                                />
                              </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Email</label>
                                <input
                                  type="email"
                                  value={editData.email || ""}
                                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                  className="input-field mt-2 w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">Subjects (comma-separated)</label>
                                <input
                                  type="text"
                                  value={formatSubjects(editData.subjects)}
                                  onChange={(e) => setEditData({ ...editData, subjects: e.target.value })}
                                  className="input-field mt-2 w-full"
                                  placeholder="Math, Science, English"
                                />
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={saveEdit}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                              >
                                <Check size={18} />
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex items-center gap-2 rounded-lg bg-slate-300 px-5 py-2 font-semibold text-slate-800 hover:bg-slate-400"
                              >
                                <X size={18} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={request._id} className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-md hover:shadow-lg transition">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-brand-900">{request.name}</h3>
                              <p className="text-sm text-slate-500">{request.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                                {formatStatus(request)}
                              </span>
                              {request.matchStatus !== "contracted" && (
                                <button
                                  onClick={() => startEdit("tutor", request)}
                                  className="rounded-lg bg-brand-100 p-2 text-brand-700 hover:bg-brand-200"
                                >
                                  <Edit2 size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold">Qualification:</span> {request.qualification}
                            </p>
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold">Fees:</span> Rs. {request.fees}/hr
                            </p>
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold">Time slot:</span> {request.timeSlot}
                            </p>
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold">Phone:</span> {request.phone}
                            </p>
                          </div>
                          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                            <span className="font-semibold">Subjects:</span> {request.subjects.join(", ")}
                          </div>
                          {request.matchedStudents?.length ? (
                            <div className="mt-4 rounded-xl border-2 border-green-200 bg-green-50 p-4 space-y-4">
                              <p className="text-sm font-bold text-green-900">✓ Matched Students</p>
                              {request.matchedStudents.map((student) => (
                                <div key={student.id} className="rounded-2xl border border-green-100 bg-white p-3">
                                  <p className="text-sm font-semibold text-green-800">{student.name}</p>
                                  <p className="text-sm text-green-700">Email: {student.email}</p>
                                  <p className="text-sm text-green-700">Contact: {student.parentContact}</p>
                                  <p className="text-sm text-green-700">Class: {student.class}</p>
                                  <p className="text-sm text-green-700">Time slot: {student.timeSlot}</p>
                                  <p className="text-sm text-green-700">Subjects: {student.subjects?.join(", ")}</p>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )
                    )
                  ) : (
                    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 text-sm text-slate-500">
                      No tutor requests found yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default ProfilePage;
