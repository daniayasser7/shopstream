function formatAddress(address) {
  if (!address) return "";
  return [address.address, address.city, address.state, address.country]
    .filter(Boolean)
    .join(", ");
}

function UserInfoList({ user }) {
  const rows = [
    { label: "Username", value: `@${user.username}` },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Gender", value: user.gender },
    { label: "Age", value: user.age },
    { label: "Birth date", value: user.birthDate },
    { label: "Address", value: formatAddress(user.address) },
  ];

  return (
    <dl className="ss-info-list">
      {rows.map((row) => (
        <div key={row.label} className="ss-info-row">
          <dt>{row.label}</dt>
          <dd className="text-capitalize-first">{row.value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export default UserInfoList;