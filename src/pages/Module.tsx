import { useParams, Navigate } from 'react-router-dom';
import { getModule } from '../modules';
import IntroModule from './modules/IntroModule';
import LearningModule from './modules/LearningModule';
import VisionModule from './modules/VisionModule';
import NLPModule from './modules/NLPModule';
import AgentsModule from './modules/AgentsModule';
import AutonomousModule from './modules/AutonomousModule';
import CyberModule from './modules/CyberModule';
import EthicsModule from './modules/EthicsModule';

export default function Module() {
  const { slug = '' } = useParams();
  const m = getModule(slug);
  if (!m) return <Navigate to="/" replace />;

  switch (slug) {
    case 'intro': return <IntroModule />;
    case 'how-ai-learns': return <LearningModule />;
    case 'computer-vision': return <VisionModule />;
    case 'nlp-llm': return <NLPModule />;
    case 'agents': return <AgentsModule />;
    case 'autonomous': return <AutonomousModule />;
    case 'cybersecurity': return <CyberModule />;
    case 'ethics': return <EthicsModule />;
    default: return <Navigate to="/" replace />;
  }
}
