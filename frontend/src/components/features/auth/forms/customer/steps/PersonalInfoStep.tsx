import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input, DatePicker } from '@/components/ui';
import { CustomerRegistrationFormData } from '@/core/schemas';

interface PersonalInfoStepProps {
  register: UseFormRegister<CustomerRegistrationFormData>;
  errors: FieldErrors<CustomerRegistrationFormData>;
  watch: any;
  setValue: any;
}

export function PersonalInfoStep({ register, errors, watch, setValue }: PersonalInfoStepProps) {
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
          Date of Birth <span className="text-gray-400 text-sm">(optional)</span>
        </label>
        <DatePicker
          value={watch('birthDate')}
          onChange={(date) => setValue('birthDate', date)}
          error={errors.birthDate?.message}
        />
      </div>
    </div>
  );
}