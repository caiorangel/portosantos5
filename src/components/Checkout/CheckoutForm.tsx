import React, { useState } from 'react';
import { Car, Calendar, Package, User, Mail, Phone, Users } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { mercadoPagoService } from '../../services/mercadoPago';

const packages = [
  { nights: 3, price: 239 },
  { nights: 4, price: 279 },
  { nights: 5, price: 299 },
  { nights: 6, price: 359 },
  { nights: 8, price: 449 },
] as const;

interface CheckoutFormProps {
  initialPackage: number;
}

export default function CheckoutForm({ initialPackage = 3 }: CheckoutFormProps) {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    licensePlate: '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    packageNights: initialPackage,
    passengers: 1
  });

  const selectedPackage = packages.find(
    (pkg) => pkg.nights === Number(formData.packageNights)
  );

  const calculateTotalPrice = () => {
    const basePrice = selectedPackage?.price || 0;
    const extraPassengerFee = formData.passengers > 4 ? 50 : 0;
    return basePrice + extraPassengerFee;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await mercadoPagoService.createAndRedirect({
        items: [{
          title: `Pacote ${formData.packageNights} Noites - Estacionamento Porto Santos`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: calculateTotalPrice(),
        }],
        payer: {
          name: formData.fullName,
          email: formData.email,
          phone: {
            number: formData.phone
          }
        },
        metadata: {
          licensePlate: formData.licensePlate,
          startDate: formData.startDate,
          endDate: formData.endDate,
          packageNights: formData.packageNights,
          passengers: formData.passengers
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="(13) 99999-9999"
                  required
                />
              </div>
            </div>
          </div>

          {/* Vehicle and Package Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa do Veículo
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Entrada
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
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
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Passageiros
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  name="passengers"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {formData.passengers > 4 && (
                <p className="text-sm text-orange-600 mt-1">
                  Será cobrada uma taxa adicional de R$ 50,00 para mais de 4 passageiros.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pacote
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  name="packageNights"
                  value={formData.packageNights}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.nights} value={pkg.nights}>
                      {pkg.nights} Noites - R$ {pkg.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-blue-900">
              R$ {calculateTotalPrice()}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            {isLoading ? 'Processando...' : 'Continuar para Pagamento'}
          </button>
        </div>
      </form>
    </div>
  );
}