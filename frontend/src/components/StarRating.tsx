interface StarRatingProps {
  score: number;
  size?: 'sm' | 'md';
}

export default function StarRating({ score, size = 'sm' }: StarRatingProps) {
  const rounded = Math.round(score);
  const starSize = size === 'sm' ? 'text-sm' : 'text-lg';

  return (
    <span className={`inline-flex ${starSize}`} data-testid="star-rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rounded ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
      <span className="ml-1 text-xs text-gray-500">{score > 0 ? score.toFixed(1) : ''}</span>
    </span>
  );
}
