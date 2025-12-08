// src/components/AboutPage.jsx
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  const teamMembers = [
    { name: 'Jenefer Yago', role: 'Full-stack Developer', icon: '👨‍💻' },
    { name: 'Rustam Islamov', role: 'Backend Developer', icon: '⚙️' },
    { name: 'Mahammad Rustamov', role: 'Frontend Developer', icon: '🎨' },
    { name: 'Rustam Yariyev', role: 'Full-stack Developer', icon: '💻' },
    { name: 'Sadig Shikhaliyev', role: 'Full-stack Developer', icon: '🚀' }
  ];

  const features = [
    {
      icon: '🔍',
      title: 'Easy Discovery',
      description: 'Find the best local deals with our powerful search and filter tools'
    },
    {
      icon: '💰',
      title: 'Save Money',
      description: 'Access exclusive discounts from hundreds of local businesses'
    },
    {
      icon: '📍',
      title: 'Local Focus',
      description: 'Support your community while saving on products and services'
    },
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'Get notified about new deals as soon as they\'re posted'
    },
    {
      icon: '❤️',
      title: 'Save Favorites',
      description: 'Keep track of deals you love and never miss an opportunity'
    },
    {
      icon: '🏢',
      title: 'Business Tools',
      description: 'Easy-to-use dashboard for businesses to promote their offers'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 
                className="text-2xl font-bold text-gray-900 cursor-pointer" 
                onClick={() => navigate('/')}
              >
                SaveMate
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/deals')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Deals
              </button>
              <button 
                onClick={() => navigate('/categories')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Categories
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                About
              </button>
            </div>
            <div>
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About SaveMate</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Your trusted platform for discovering local deals and saving money
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            SaveMate was created to bridge the gap between local businesses and savvy shoppers. 
            We believe everyone deserves access to great deals, and local businesses deserve an 
            affordable way to reach customers. Our platform makes it easy for consumers to 
            discover amazing discounts while helping businesses grow their customer base.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose SaveMate?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            SaveMate by the Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl text-blue-100">Active Deals</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-xl text-blue-100">Local Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-xl text-blue-100">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">45%</div>
              <div className="text-xl text-blue-100">Average Savings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Meet Our Team
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          WSB University - Agile Project Management Course
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="text-6xl mb-4">{member.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Built with Modern Technology
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-4xl mb-2">⚛️</div>
              <div className="font-bold">React</div>
              <div className="text-sm text-gray-600">Frontend</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-4xl mb-2">🚀</div>
              <div className="font-bold">FastAPI</div>
              <div className="text-sm text-gray-600">Backend</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-4xl mb-2">🍃</div>
              <div className="font-bold">MongoDB</div>
              <div className="text-sm text-gray-600">Database</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-4xl mb-2">🎨</div>
              <div className="font-bold">Tailwind</div>
              <div className="text-sm text-gray-600">Styling</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          How SaveMate Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">1️⃣</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Browse Deals</h3>
            <p className="text-gray-600">
              Explore hundreds of deals from local businesses in your area
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">2️⃣</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Save & Plan</h3>
            <p className="text-gray-600">
              Save your favorite deals and get directions to businesses
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">3️⃣</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Enjoy Savings</h3>
            <p className="text-gray-600">
              Show the deal at checkout and start saving money
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Have questions or want to partner with us? We'd love to hear from you!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => window.location.href = 'mailto:jp191123km@gmail.com'}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              📧 Email Us
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-colors"
            >
              🚀 Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
