interface StatsCardProps {
  number: string;
  label: string;
  icon: string;
}

export default function StatsCard({ number, label, icon }: StatsCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 group">
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      
      <div className="text-2xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
        {number}
      </div>
      
      <div className="text-white/70 text-sm">
        {label}
      </div>
    </div>
  );
} 