function FormCard({ title, subtitle, children }) {
  return (
    <div className="glass-card w-full max-w-2xl p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-800">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export default FormCard;
