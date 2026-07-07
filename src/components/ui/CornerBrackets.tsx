export default function CornerBrackets({
  className = 'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
}: {
  className?: string;
}) {
  const c = 'absolute h-2.5 w-2.5 border-accent';
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${c} left-0 top-0 border-l border-t`} />
      <span className={`${c} right-0 top-0 border-r border-t`} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} />
      <span className={`${c} bottom-0 right-0 border-b border-r`} />
    </span>
  );
}
