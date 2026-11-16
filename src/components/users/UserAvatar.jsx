function getInitials(user) {
  const first = user?.firstName?.[0] || "";
  const last = user?.lastName?.[0] || "";
  return (first + last).toUpperCase() || "?";
}

function UserAvatar({ user, size = 40 }) {
  if (user?.image) {
    return (
      <img
        src={user.image}
        alt=""
        width={size}
        height={size}
        className="ss-avatar"
      />
    );
  }

  return (
    <span
      className="ss-avatar ss-avatar-initials"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {getInitials(user)}
    </span>
  );
}

export default UserAvatar;