import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui';
import { CustomerRegistrationFormData } from '@/core/schemas';

interface ContactDetailsStepProps {
  register: UseFormRegister<CustomerRegistrationFormData>;
  errors: FieldErrors<CustomerRegistrationFormData>;
}

export function ContactDetailsStep({ register, errors }: ContactDetailsStepProps) {
  return (
    <div className="space-y-4">
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