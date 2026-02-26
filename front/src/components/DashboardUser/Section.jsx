export default function Section({ title, link, children }) {
  return (
    <div className="mt-10 px-6 max-w-md mx-auto">
      <div className="flex justify-between mb-4">
        <h3 className="font-bold">{title}</h3>
        <span className="text-[rgb(2,62,120)] font-medium">{link}</span>
      </div>
      {children}
    </div>
  );
}
