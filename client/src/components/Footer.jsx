import { Mail, PhoneCall } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-white/50 bg-white/70 py-8 backdrop-blur-xl">
      <div className="section-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xl font-bold text-brand-800">TuitionRider</p>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Helping students from Classes 1-10 discover reliable tutors for online
            and offline learning across Punjab.
          </p>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <PhoneCall size={16} className="text-brand-600" />
            +91 94651 72269
          </p>
          <p className="flex items-center gap-2">
            <Mail size={16} className="text-brand-600" />
            tuitionrider@gmail.com
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://www.instagram.com/tuitionrider/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-brand-50 p-2 text-brand-700"
              aria-label="TuitionRider Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 2.5A5.5 5.5 0 1 1 6.5 12 5.51 5.51 0 0 1 12 6.5Zm0 2A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5Zm5.75-3a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 17.75 5.5Z" />
              </svg>
            </a>
            <a
              href="mailto:tuitionrider@gmail.com"
              className="rounded-full bg-brand-50 p-2 text-brand-700"
              aria-label="TuitionRider Gmail"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
