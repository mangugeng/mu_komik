import Image from 'next/image';
import { NewsItem } from '../../lib/newsService';

interface NewsCardProps {
  news: NewsItem;
  onClick?: (news: NewsItem) => void;
}

export default function NewsCard({ news, onClick }: NewsCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Prestasi': 'bg-yellow-500',
      'Fitur': 'bg-blue-500',
      'Trending': 'bg-red-500',
      'Tips': 'bg-green-500',
      'Event': 'bg-purple-500',
      'Update': 'bg-orange-500',
      'Wawancara': 'bg-pink-500',
      'Analisis': 'bg-indigo-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div
      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 group cursor-pointer"
      onClick={onClick ? () => onClick(news) : undefined}
      tabIndex={0}
      role={onClick ? 'button' : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(news) } : undefined}
    >
      <div className="relative mb-3">
        <div className="w-full h-32 relative overflow-hidden rounded-lg">
          <Image
            src={news.imageUrl || '/images/placeholder.png'}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(news.category)}`}>
          {news.category}
        </div>
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white bg-black/50 backdrop-blur-sm">
          {formatNumber(news.views)} 👁️
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-white/70 line-clamp-2">
          {news.content}
        </p>
        
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>{news.author}</span>
          <div className="flex items-center gap-2">
            <span>{formatDate(news.publishedAt)}</span>
            <span>•</span>
            <span>❤️ {formatNumber(news.likes)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 