import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsBDPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phoneNumber: any, args: ValidationArguments) {
    if (typeof phoneNumber !== 'string') return false;
    const bdPhoneRegex = /^(?:\+880|0)?1\d{9}$/;

    return bdPhoneRegex.test(phoneNumber);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Phone number must be a valid Bangladeshi number starting with +880, 01, or 1 followed by 9 digits';
  }
}

export function IsBDPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBDPhoneNumberConstraint,
    });
  };
}
