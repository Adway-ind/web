import { useTransition } from "../custom/TransitionContext";

export default function TransitionLink({ to, children, className, onClick, style }) {
  const { navigateTo } = useTransition();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}