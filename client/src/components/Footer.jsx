import { Globe2, Mail, PhoneCall, Send } from "lucide-react";

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
            hello@tuitionrider.com
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a href="https://facebook.com" className="rounded-full bg-brand-50 p-2 text-brand-700">
              <Globe2 size={16} />
            </a>
            <a href="https://instagram.com" className="rounded-full bg-brand-50 p-2 text-brand-700">
              <Send size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
