import React from 'react';
import { Star, Phone, Mail, Calendar, MapPin, Award, TrendingUp } from 'lucide-react';

interface Consultant {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
  email: string;
  image: string;
  hourlyRate: number;
  languages: string[];
  certifications: string[];
  description: string;
  availability: 'Available' | 'Busy' | 'Offline';
}

interface ConsultantCardProps {
  consultant: Consultant;
  onBookConsultation: (consultantId: string) => void;
  onContact: (consultantId: string, method: 'phone' | 'email') => void;
}

export const ConsultantCard: React.FC<ConsultantCardProps> = ({ 
  consultant, 
  onBookConsultation,
  onContact 
}) => {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200';
      case 'Busy':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
      case 'Offline':
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <img
            src={consultant.image}
            alt={consultant.name}
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover shadow-lg"
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div 
            className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg lg:text-xl shadow-lg hidden"
          >
            {consultant.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
            consultant.availability === 'Available' ? 'bg-emerald-500' :
            consultant.availability === 'Busy' ? 'bg-yellow-500' : 'bg-gray-400'
          }`}></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800">{consultant.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(consultant.availability)}`}>
              {consultant.availability}
            </span>
          </div>
          
          <p className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium text-sm mb-1">{consultant.title}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium text-gray-700">{consultant.rating}</span>
              <span>({consultant.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>{consultant.experience} years exp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Specializations</h4>
        <div className="flex flex-wrap gap-2">
          {consultant.specialization.map((spec, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 rounded-full text-xs font-medium border border-cyan-200"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{consultant.description}</p>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{consultant.location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>₹{consultant.hourlyRate}/hour consultation</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-xs">Languages:</span>
          <span className="text-xs">{consultant.languages.join(', ')}</span>
        </div>
      </div>

      {/* Certifications */}
      {consultant.certifications.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Certifications</h4>
          <div className="flex flex-wrap gap-1">
            {consultant.certifications.slice(0, 2).map((cert, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 rounded-lg text-xs border border-emerald-200"
              >
                {cert}
              </span>
            ))}
            {consultant.certifications.length > 2 && (
              <span className="px-2 py-1 bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 rounded-lg text-xs border border-gray-200">
                +{consultant.certifications.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => onBookConsultation(consultant.id)}
          disabled={consultant.availability === 'Offline'}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
        >
          <Calendar className="w-4 h-4" />
          Book Consultation
        </button>
        
        <div className="flex gap-2 sm:flex-shrink-0">
          <button
            onClick={() => onContact(consultant.id, 'phone')}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-200"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onContact(consultant.id, 'email')}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-200"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};