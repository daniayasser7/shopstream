function RoleBadge({ role = "user" }) {
  return (
    <span className={`badge rounded-pill text-capitalize ss-role ss-role-${role}`}>
      {role}
    </span>
  );
}

export default RoleBadge;