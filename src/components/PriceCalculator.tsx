import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Package {
  nights: number;
  price: number;
}

const packages: Package[] = [
  { nights: 3, price: 239 },
  { nights: 4, price: 279 },
  { nights: 5, price: 299 },
  { nights: 6, price: 359 },
  { nights: 8, price: 449 },
];

export default function PriceCalculator() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [recommendedPackage, setRecommendedPackage] = useState<Package | null>(null);

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffNights);

      // Find best package
      const bestPackage = packages.reduce((prev, curr) => {
        return Math.abs(curr.nights - diffNights) < Math.abs(prev.nights - diffNights) ? curr : prev;
      });

      setRecommendedPackage(bestPackage);
      setTotalPrice(bestPackage.price);
    }
  }, [checkIn, checkOut]);

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Calcule seu Pacote</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Entrada
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Saída
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {nights > 0 && recommendedPackage && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-900 mb-2">
              <Clock size={20} />
              <span className="font-medium">{nights} noites</span>
            </div>
            <p className="text-gray-600 mb-2">
              Pacote recomendado: {recommendedPackage.nights} noites
            </p>
            <p className="text-2xl font-bold text-blue-900 mb-4">
              R$ {totalPrice.toFixed(2)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to={`/checkout?package=${recommendedPackage.nights}&startDate=${checkIn}&endDate=${checkOut}`}
                className="block w-full bg-blue-900 text-white text-center py-3 rounded-lg hover:bg-blue-800 transition"
              >
                Reservar Agora
              </Link>
              <a
                href="https://wa.me/5513991260211"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition"
              >
                Via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}