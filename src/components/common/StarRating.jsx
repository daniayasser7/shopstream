import { Star, StarFill, StarHalf } from "react-bootstrap-icons";

function StarRating({ rating, size = 16 }) {
  const stars = [1, 2, 3, 4, 5].map((position) => {
    if (rating >= position) return <StarFill key={position} size={size} />;
    if (rating >= position - 0.5) return <StarHalf key={position} size={size} />;
    return <Star key={position} size={size} />;
  });

  return (
    <span
      className="ss-stars"
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
    >
      {stars}
    </span>
  );
}

export default StarRating;