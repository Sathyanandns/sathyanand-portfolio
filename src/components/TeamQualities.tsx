import { useInView } from '../hooks/useInView';
import { teamQualities } from '../data/skills';
import {
  Lightbulb,
  MessageCircle,
  ShieldCheck,
  Users,
  Zap,
  RefreshCw,
  Clock,
  Search,
  Settings,
  TrendingUp,
  Handshake,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  lightbulb: <Lightbulb size={18} />,
  'message-circle': <MessageCircle size={18} />,
  'shield-check': <ShieldCheck size={18} />,
  users: <Users size={18} />,
  zap: <Zap size={18} />,
  'refresh-cw': <RefreshCw size={18} />,
  clock: <Clock size={18} />,
  search: <Search size={18} />,
  settings: <Settings size={18} />,
  'trending-up': <TrendingUp size={18} />,
};

export default function TeamQualities() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const { ref: gridRef, isInView: gridInView } = useInView(0.1);

  return (
    <section className="section">
      <div className="container">
        <div className={`section-header animate-in ${headerInView ? 'visible' : ''}`} ref={headerRef}>
          <span className="section-label">
            <Handshake size={14} /> What I Bring
          </span>
          <h2 className="section-title">What I Bring to a Team</h2>
          <p className="section-subtitle">
            Beyond technical skills — the qualities that make collaboration effective.
          </p>
        </div>

        <div className="qualities-grid stagger" ref={gridRef}>
          {teamQualities.map((quality, i) => (
            <div
              key={quality.title}
              className={`quality-card animate-in ${gridInView ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="quality-icon">
                {iconMap[quality.icon] || <Lightbulb size={18} />}
              </div>
              <span className="quality-title">{quality.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
