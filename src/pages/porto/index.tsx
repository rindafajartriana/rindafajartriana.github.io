import React from "react";

const projects = [
  {
    title: "Project A",
    subtitle: "Finance Tracker",
    description: "Web-based app to manage and track personal finances.",
  },
  {
    title: "Project B",
    subtitle: "Task Manager",
    description: "Mobile app for organizing daily tasks and reminders.",
  },
  {
    title: "Project C",
    subtitle: "E-commerce CMS",
    description: "Custom CMS platform for e-commerce businesses.",
  },
];

const techStack = [
  {
    icon: "⚛️",
    name: "React JS",
    desc: "Modern UI with hooks and reusable components.",
  },
  {
    icon: "📱",
    name: "React Native",
    desc: "Cross-platform mobile app development.",
  },
  {
    icon: "🧩",
    name: "NestJS",
    desc: "Robust backend with TypeScript and modules.",
  },
  {
    icon: "🚀",
    name: "ExpressJS",
    desc: "Fast API development with Node.js.",
  },
];

const Porto = () => {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-0 to-blue-100 text-gray-800 text-center font-sans">
      <h1 className="text-4xl font-bold mb-1">👩‍💻 Rinda Fajar Triana</h1>
      <p className="text-lg text-gray-600 mb-8">
        Passionate developer focused on creating seamless user experiences and
        scalable backend systems.
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">👋 About Me</h2>
        <p className="text-sm text-gray-700 max-w-3xl mx-auto">
          I'm a passionate and curious software developer who loves building
          apps that matter. I specialize in fullstack development, both web and
          mobile, with a focus on clean UI, efficient backend, and smooth
          deployment processes. I enjoy exploring new technologies,
          collaborating with teams, and bringing ideas to life through code.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">🛠 Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 w-60 hover:-translate-y-1 transition-transform"
            >
              <div className="text-4xl mb-2">{tech.icon}</div>
              <h3 className="text-xl font-semibold mb-1">{tech.name}</h3>
              <p className="text-sm text-gray-600">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">🧠 Skills Summary</h2>
        <ul className="text-sm text-gray-700 flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          <li>React JS</li>
          <li>React Native</li>
          <li>TypeScript</li>
          <li>PHP</li>
          <li>CodeIgniter</li>
          <li>NestJS</li>
          <li>ExpressJS</li>
          <li>MySQL</li>
          <li>GitHub</li>
          <li>CI/CD</li>
          <li>Jenkins</li>
          <li>Technical Writing</li>
          <li>API Integration</li>
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">📂 Projects</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 w-60 hover:-translate-y-1 transition-transform"
            >
              <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
              <h4 className="text-sm text-gray-500 mb-2">{project.subtitle}</h4>
              <p className="text-sm text-gray-600 mb-3">
                {project.description}
              </p>
              {/* Tambah link kalau ada */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline"
              >
                View Project
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">📫 Contact</h2>
        <p className="text-sm text-gray-700">
          Email:{" "}
          <a
            href="mailto:rindafajartriana@gmail.com"
            className="text-blue-600 underline"
          >
            rindafajartriana@gmail.com
          </a>
        </p>
        <p className="text-sm text-gray-700">
          Find me on{" "}
          <a href="#" className="text-blue-600 underline">
            LinkedIn
          </a>
          ,{" "}
          <a href="#" className="text-blue-600 underline">
            GitHub
          </a>
          ,{" "}
          <a href="#" className="text-blue-600 underline">
            Twitter
          </a>
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">
          📚 Internship Experience
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 w-80 text-left">
            <h3 className="text-xl font-semibold">
              Badan Kesbangpol Provinsi Jawa Barat
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Internship – Inventory & Vehicle Loan App
            </p>
            <p className="text-sm text-gray-600">
              Developed an internal application for inventory management and
              vehicle loan using PHP CodeIgniter (CI).
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">💼 Work Experience</h2>
        <div className="flex flex-col items-center gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl text-left">
            <h3 className="text-xl font-semibold">
              PT. Mulya Kencana Metalindo
            </h3>
            <p className="text-sm text-gray-500 mb-1">📅 Nov 2022 – Mar 2023</p>
            <p className="text-sm text-gray-600 mb-2">Role: Technical Writer</p>

            <p className="text-sm text-gray-500 mb-1">📅 Mar 2023 – Aug 2024</p>
            <p className="text-sm text-gray-600 mb-2">
              Role: Fullstack Developer
            </p>
            <p className="text-sm text-gray-600">
              Tech Stack: React Native, PHP, JavaScript, TypeScript, Webhook
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl text-left">
            <h3 className="text-xl font-semibold">PT. Kartika Sinar Mulia</h3>
            <p className="text-sm text-gray-500 mb-1">📅 Aug 2024 – Dec 2024</p>
            <p className="text-sm text-gray-600 mb-2">
              Role: Frontend Developer
            </p>
            <p className="text-sm text-gray-600">
              Tech Stack: React Native, React.js, Jenkins, GitHub, CI/CD
            </p>

            <p className="text-sm text-gray-500 mt-4 mb-1">
              📅 Dec 2024 – Present
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Role: Fullstack Developer
            </p>
            <p className="text-sm text-gray-600">
              Tech Stack: React Native, React.js, NestJS, MySQL, Jenkins,
              GitHub, CI/CD
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-12 text-xs text-gray-500 italic">
        <p>© 2025 Rinda Fajar Triana | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Porto;
