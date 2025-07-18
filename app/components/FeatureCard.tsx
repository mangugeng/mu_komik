import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
}

export default function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 group">
      <div className={`w-12 h-12 rounded-lg ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-white text-xl">
          {icon}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
        {title}
      </h3>
      
      <p className="text-white/70 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
} 