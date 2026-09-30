import Link from "next/link";

const apps = [
  {
    href: "/estimator",
    title: "Property Value Estimator",
    description:
      "Enter a property's details, get a price estimate, review your history and compare properties side by side.",
    tech: "Python · FastAPI backend",
  },
  {
    href: "/market",
    title: "Property Market Analysis",
    description:
      "Explore market statistics, filter property segments, run what-if scenarios and export the data.",
    tech: "Java · Spring Boot backend",
  },
];

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Property Portal</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Two independent applications, each with its own backend, both powered by
        the same housing price prediction model.
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {apps.map((app) => (
          <li key={app.href}>
            <Link
              href={app.href}
              className="block h-full rounded-lg border border-line bg-surface p-6 transition-shadow hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">{app.title}</h2>
              <p className="mt-2 text-muted">{app.description}</p>
              <p className="mt-4 text-sm font-medium text-brand">{app.tech}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}