import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import Loader from "../components/Loader";
import { api } from "../config/api";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <PageShell>
      <section className="section-shell py-10">
        <div className="glass-card p-6 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Welcome back</p>
            <h1 className="mt-4 text-3xl font-bold text-brand-900">{user?.name || "Student"}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Here are your requests and matched connections. Your profile will show details as soon as a match is found.
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
                    profileData.studentRequests.map((request) => (
                      <div key={request._id} className="rounded-[1.5rem] border border-brand-100 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-brand-900">{request.name}</h3>
                            <p className="text-sm text-slate-500">{request.email}</p>
                          </div>
                          <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                            {formatStatus(request)}
                          </span>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <p className="text-sm text-slate-600">Class: {request.class}</p>
                          <p className="text-sm text-slate-600">Budget: Rs. {request.budget}/hr</p>
                          <p className="text-sm text-slate-600">Parent contact: {request.parentContact}</p>
                        </div>
                        {request.matchStatus === "contracted" && request.matchedTutor ? (
                          <div className="mt-4 rounded-3xl border border-brand-100 bg-brand-50 p-4">
                            <p className="text-sm font-semibold text-brand-900">Matched Tutor</p>
                            <p className="text-sm text-slate-600">{request.matchedTutor.name}</p>
                            <p className="text-sm text-slate-600">Email: {request.matchedTutor.email}</p>
                            <p className="text-sm text-slate-600">Phone: {request.matchedTutor.phone}</p>
                            <p className="text-sm text-slate-600">Qualification: {request.matchedTutor.qualification}</p>
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] border border-brand-100 bg-white p-6 text-sm text-slate-500">
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
                    profileData.tutorRequests.map((request) => (
                      <div key={request._id} className="rounded-[1.5rem] border border-brand-100 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-brand-900">{request.name}</h3>
                            <p className="text-sm text-slate-500">{request.email}</p>
                          </div>
                          <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                            {formatStatus(request)}
                          </span>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <p className="text-sm text-slate-600">Qualification: {request.qualification}</p>
                          <p className="text-sm text-slate-600">Fees: Rs. {request.fees}/hr</p>
                          <p className="text-sm text-slate-600">Subjects: {request.subjects.join(", ")}</p>
                          <p className="text-sm text-slate-600">Phone: {request.phone}</p>
                        </div>
                        {request.matchStatus === "contracted" && request.matchedStudent ? (
                          <div className="mt-4 rounded-3xl border border-brand-100 bg-brand-50 p-4">
                            <p className="text-sm font-semibold text-brand-900">Matched Student</p>
                            <p className="text-sm text-slate-600">{request.matchedStudent.name}</p>
                            <p className="text-sm text-slate-600">Email: {request.matchedStudent.email}</p>
                            <p className="text-sm text-slate-600">Contact: {request.matchedStudent.parentContact}</p>
                            <p className="text-sm text-slate-600">Class: {request.matchedStudent.class}</p>
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] border border-brand-100 bg-white p-6 text-sm text-slate-500">
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
