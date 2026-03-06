import { Award, ExternalLink } from 'lucide-react';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  year: string;
  description: string;
  color: string;
}

const certificates: Certificate[] = [
  {
    id: 1,
    title: 'Meta Frontend Developer',
    issuer: 'Meta / Coursera',
    year: '2023',
    description: 'Professional certificate covering React, JavaScript, HTML/CSS, and modern frontend development practices.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 2,
    title: 'CS50x: Introduction to Computer Science',
    issuer: 'Harvard / edX',
    year: '2022',
    description: 'Harvard\'s renowned intro to CS — algorithms, data structures, C, Python, SQL, and web development.',
    color: 'from-red-500 to-red-700',
  },
  {
    id: 3,
    title: 'JavaScript Algorithms & Data Structures',
    issuer: 'freeCodeCamp',
    year: '2022',
    description: 'Deep-dive into JavaScript fundamentals, ES6+, algorithms, and data structures through hands-on projects.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 4,
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    year: '2021',
    description: 'HTML5, CSS3, Flexbox, Grid, and responsive design principles — building accessible and mobile-first UIs.',
    color: 'from-emerald-500 to-green-700',
  },
];

const Certificates = () => {
  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-[#2d2d2d] border-b border-black/30">
        <Award className="w-6 h-6 text-yellow-400" />
        <div>
          <h2 className="text-white font-semibold text-base">Certificates & Achievements</h2>
          <p className="text-white/40 text-xs">{certificates.length} certificates</p>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="flex-1 p-6 grid grid-cols-1 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="flex items-start gap-4 p-4 bg-white/5 hover:bg-white/8 rounded-xl border border-white/10 transition-colors"
          >
            {/* Icon */}
            <div className={`w-14 h-14 flex-shrink-0 bg-gradient-to-br ${cert.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <Award className="w-7 h-7 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-white font-medium text-sm leading-tight">{cert.title}</h3>
                  <p className="text-white/50 text-xs mt-0.5">{cert.issuer} · {cert.year}</p>
                </div>
                <span className="flex-shrink-0 px-2 py-0.5 bg-yellow-400/15 text-yellow-400 text-[10px] rounded-full border border-yellow-400/20 font-medium">
                  Certified
                </span>
              </div>
              <p className="text-white/40 text-xs mt-2 leading-relaxed">{cert.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-[#2d2d2d] border-t border-black/30">
        <p className="text-white/30 text-xs text-center">
          More certifications and achievements at{' '}
          <span className="text-blue-400">mehrabdev.com</span>
        </p>
      </div>
    </div>
  );
};

export default Certificates;
