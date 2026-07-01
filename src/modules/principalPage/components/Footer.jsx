export default function Footer() {
  const links = [
    "Privacy Policy",
    "Terms of Service",
    "Driver Agreement",
    "Help Center",
  ];

  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-slate-900">Mi Conductor</p>
          <p className="text-xs text-slate-400">
            © 2024 Mi Conductor. Premium Driving Solutions.
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
          {links.map((link) => (
            <li key={link}>
              <a href="#" className="hover:text-slate-800 transition-colors">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}