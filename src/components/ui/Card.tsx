interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${
        hover
          ? "hover:shadow-lg hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-300"
          : "transition-shadow duration-200"
      } ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
