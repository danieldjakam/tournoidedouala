export default function Section({ title, link, children, className = "" }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg sm:text-xl">{title}</h3>
        {link && (
          <span className="text-[rgb(2,62,120)] font-medium text-sm sm:text-base cursor-pointer hover:underline">
            {link}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
