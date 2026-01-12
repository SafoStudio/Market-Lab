import { AddressFormData } from "@/core/schemas";

interface ConfirmationStepProps {
  formData: {
    firstName: string;
    lastName: string;
    birthDate?: Date;
    phone: string;
    address: AddressFormData;
  };
}

export function CustomerConfirmationStep({ formData }: ConfirmationStepProps) {
  const formatAddress = (address: AddressFormData) => {
    const parts = [
      address.street && address.building && `${address.street} ${address.building}`,
      address.city,
      address.state,
      address.country,
      address.postalCode,
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-gray-900">Review Your Information</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{formData.firstName} {formData.lastName}</p>
          </div>
          <div>
            <p className="text-gray-500">Birth Date</p>
            <p className="font-medium">
              {formData.birthDate?.toLocaleDateString() || 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{formData.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500">Address</p>
            <p className="font-medium">
              {formatAddress(formData.address) || 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          Your information will be used to personalize your experience and for delivery purposes.
        </p>
      </div>
    </div>
  );
}