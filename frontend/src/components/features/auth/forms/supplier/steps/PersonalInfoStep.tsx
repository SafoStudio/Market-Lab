import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui';
import { SupplierRegistrationFormData } from '@/core/schemas';

interface PersonalInfoStepProps {
  register: UseFormRegister<SupplierRegistrationFormData>;
  errors: FieldErrors<SupplierRegistrationFormData>;
}

export function PersonalInfoStep({ register, errors }: PersonalInfoStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <Input
            {...register('firstName')}
            placeholder="John"
            error={errors.firstName?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <Input
            {...register('lastName')}
            placeholder="Doe"
            error={errors.lastName?.message}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <Input
          {...register('phone')}
          placeholder="+380 XX XXX XXXX"
          error={errors.phone?.message}
        />
      </div>
    </div>
  );
}