function EmptyState({ icon: Icon, title, message, children }) {
  return (
    <div className="text-center py-5 px-3">
      {Icon && (
        <div className="ss-empty-icon mx-auto mb-3">
          <Icon size={28} aria-hidden="true" />
        </div>
      )}
      <h2 className="h4 fw-bold">{title}</h2>
      {message && <p className="text-body-secondary mb-4">{message}</p>}
      {children}
    </div>
  );
}

export default EmptyState;