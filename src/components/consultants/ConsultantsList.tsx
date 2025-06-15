import React, { useState } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { ConsultantCard } from './ConsultantCard';
import { BookingModal } from './BookingModal';

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

export const ConsultantsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'rate'>('rating');
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const consultants: Consultant[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      title: 'Certified Financial Planner (CFP)',
      specialization: ['Financial Planning', 'Investment Advisory', 'Retirement Planning'],
      experience: 12,
      rating: 4.9,
      reviews: 156,
      location: 'Mumbai, Maharashtra',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@finplan.com',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 2500,
      languages: ['English', 'Hindi', 'Marathi'],
      certifications: ['CFP', 'CFA Level II', 'NISM Series V-A'],
      description: 'Experienced financial planner with over 12 years in wealth management. Specializes in comprehensive financial planning for high-net-worth individuals and families.',
      availability: 'Available'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      title: 'Investment Advisor & Tax Consultant',
      specialization: ['Tax Planning', 'Mutual Funds', 'Portfolio Management'],
      experience: 8,
      rating: 4.8,
      reviews: 89,
      location: 'Delhi, NCR',
      phone: '+91 87654 32109',
      email: 'priya.sharma@taxadvisor.com',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 2000,
      languages: ['English', 'Hindi', 'Punjabi'],
      certifications: ['CA', 'NISM Series V-A', 'CFP'],
      description: 'Chartered Accountant with expertise in tax optimization and investment planning. Helps clients maximize returns while minimizing tax liability.',
      availability: 'Available'
    },
    {
      id: '3',
      name: 'Arjun Patel',
      title: 'Retirement & Insurance Specialist',
      specialization: ['Retirement Planning', 'Insurance Planning', 'Estate Planning'],
      experience: 15,
      rating: 4.9,
      reviews: 203,
      location: 'Bangalore, Karnataka',
      phone: '+91 76543 21098',
      email: 'arjun.patel@retirewell.com',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 3000,
      languages: ['English', 'Hindi', 'Gujarati', 'Kannada'],
      certifications: ['CFP', 'ChFC', 'LUTCF'],
      description: 'Senior financial advisor specializing in retirement and insurance planning. Helped over 500 families secure their financial future.',
      availability: 'Busy'
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      title: 'Debt Management & Budget Specialist',
      specialization: ['Debt Management', 'Budget Planning', 'Financial Counseling'],
      experience: 6,
      rating: 4.7,
      reviews: 67,
      location: 'Hyderabad, Telangana',
      phone: '+91 65432 10987',
      email: 'sneha.reddy@debtfree.com',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 1500,
      languages: ['English', 'Hindi', 'Telugu'],
      certifications: ['AFC', 'NFEC Certified'],
      description: 'Passionate about helping individuals overcome debt and build healthy financial habits. Specializes in budget optimization and debt consolidation strategies.',
      availability: 'Available'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      title: 'Investment Banking & Wealth Management',
      specialization: ['Wealth Management', 'Investment Banking', 'Corporate Finance'],
      experience: 18,
      rating: 4.9,
      reviews: 312,
      location: 'Mumbai, Maharashtra',
      phone: '+91 54321 09876',
      email: 'vikram.singh@wealthpro.com',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 4000,
      languages: ['English', 'Hindi'],
      certifications: ['CFA', 'FRM', 'CAIA'],
      description: 'Former investment banker with extensive experience in wealth management for ultra-high-net-worth clients. Expert in complex financial structures and alternative investments.',
      availability: 'Available'
    },
    {
      id: '6',
      name: 'Meera Joshi',
      title: 'Women\'s Financial Empowerment Advisor',
      specialization: ['Financial Literacy', 'Women\'s Finance', 'Goal-based Planning'],
      experience: 10,
      rating: 4.8,
      reviews: 145,
      location: 'Pune, Maharashtra',
      phone: '+91 43210 98765',
      email: 'meera.joshi@womenfinance.com',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
      hourlyRate: 1800,
      languages: ['English', 'Hindi', 'Marathi'],
      certifications: ['CFP', 'AFC', 'Women\'s Financial Planning Specialist'],
      description: 'Dedicated to empowering women through financial education and planning. Specializes in helping women achieve financial independence and security.',
      availability: 'Available'
    }
  ];

  const filteredConsultants = consultants
    .filter(consultant => {
      const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultant.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSpecialization = filterSpecialization === 'all' ||
                                   consultant.specialization.some(spec => spec.toLowerCase().includes(filterSpecialization.toLowerCase()));
      
      const matchesLocation = filterLocation === 'all' ||
                             consultant.location.toLowerCase().includes(filterLocation.toLowerCase());
      
      return matchesSearch && matchesSpecialization && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'rate':
          return a.hourlyRate - b.hourlyRate;
        default:
          return 0;
      }
    });

  const handleBookConsultation = (consultantId: string) => {
    const consultant = consultants.find(c => c.id === consultantId);
    if (consultant) {
      setSelectedConsultant(consultant);
      setIsBookingModalOpen(true);
    }
  };

  const handleContact = (consultantId: string, method: 'phone' | 'email') => {
    const consultant = consultants.find(c => c.id === consultantId);
    if (consultant) {
      if (method === 'phone') {
        window.open(`tel:${consultant.phone}`);
      } else {
        window.open(`mailto:${consultant.email}`);
      }
    }
  };

  const handleBooking = (bookingData: any) => {
    // In a real app, this would send the booking data to a backend
    console.log('Booking data:', bookingData);
    alert(`Consultation booked successfully! You will receive a confirmation email shortly.`);
  };

  const specializations = ['Financial Planning', 'Investment Advisory', 'Tax Planning', 'Retirement Planning', 'Debt Management', 'Insurance Planning'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Financial Consultants</h1>
          <p className="text-purple-100 text-lg">Connect with certified financial experts for personalized advice</p>
          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{consultants.length}</p>
                <p className="text-sm text-purple-100">Expert Consultants</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-purple-100">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search consultants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'experience' | 'rate')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">Sort by Rating</option>
              <option value="experience">Sort by Experience</option>
              <option value="rate">Sort by Rate (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConsultants.map((consultant) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            onBookConsultation={handleBookConsultation}
            onContact={handleContact}
          />
        ))}
      </div>

      {filteredConsultants.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No consultants found matching your criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterSpecialization('all');
              setFilterLocation('all');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        consultant={selectedConsultant}
        onBooking={handleBooking}
      />
    </div>
  );
};