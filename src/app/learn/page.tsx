import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn AI — Best Courses, Books & Resources (2026)",
  description:
    "Curated collection of the best AI learning resources. Courses, certifications, books, and tutorials to master AI and start earning.",
};

const courses = [
  { name: "Google AI Essentials", provider: "Coursera", price: "Free", level: "Beginner", url: "#" },
  { name: "DeepLearning.AI Specialization", provider: "Coursera", price: "$49/mo", level: "Intermediate", url: "#" },
  { name: "Prompt Engineering for Developers", provider: "DeepLearning.AI", price: "Free", level: "Beginner", url: "#" },
  { name: "AI for Everyone", provider: "Coursera", price: "Free", level: "Beginner", url: "#" },
  { name: "Building AI Agents", provider: "LangChain", price: "Free", level: "Intermediate", url: "#" },
  { name: "AWS Machine Learning Specialty", provider: "AWS", price: "$300 exam", level: "Advanced", url: "#" },
];

const books = [
  { title: "AI Superpowers", author: "Kai-Fu Lee", year: "2018" },
  { title: "The Coming Wave", author: "Mustafa Suleyman", year: "2023" },
  { title: "Co-Intelligence", author: "Ethan Mollick", year: "2024" },
  { title: "Life 3.0", author: "Max Tegmark", year: "2017" },
];

export default function LearnPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-cyan-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Learn
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Learn AI — <span className="text-accent">Courses, Books & Resources</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            The best resources to master AI and start earning. Curated and regularly updated.
          </p>
        </div>
      </section>

      {/* Courses — white bg */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Top AI Courses
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="pb-3 pr-4 font-bold text-gray-900">Course</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900">Provider</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900">Price</th>
                  <th className="pb-3 font-bold text-gray-900">Level</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-gray-900">{c.name}</td>
                    <td className="py-3 pr-4 text-gray-500">{c.provider}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-semibold ${c.price === "Free" ? "text-emerald-600" : "text-gray-600"}`}>
                        {c.price}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        c.level === "Beginner" ? "bg-emerald-50 text-emerald-700"
                          : c.level === "Intermediate" ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                      }`}>
                        {c.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Books — gray bg */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Essential AI Books
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {books.map((book) => (
              <div key={book.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="w-full h-32 bg-background rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-accent text-3xl font-bold">{book.title[0]}</span>
                </div>
                <h3 className="font-semibold text-sm text-gray-900">{book.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{book.author} ({book.year})</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
