/*
  Este archivo contiene validaciones de negocio para HealthCore.
  Las validaciones sirven para comprobar que los datos cumplen reglas mínimas antes de guardarlos, procesarlos o usarlos en reportes.
*/
import type {
  Appointment,
  AppointmentStatus,
  BillingClaim,
  BillingClaimStatus,
  Clinic,
  ComplianceAction,
  ComplianceLog,
  Country,
  Department,
  Patient,
  RiskLevel,
  StaffMember,
  StaffRole,
  ValidationResult,
} from "../types/models";
/*
  Listas de valores permitidos.

*/
const allowedCountries: Country[] = ["US", "UK"];
const allowedAppointmentStatuses: AppointmentStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
  "no-show",
];
const allowedDepartments: Department[] = [
  "clinical-operations",
  "patient-experience",
  "revenue-cycle",
  "compliance",
  "people-workforce",
  "technology",
  "executive",
];
const allowedStaffRoles: StaffRole[] = [
  "doctor",
  "nurse",
  "administrator",
  "billing-specialist",
  "compliance-officer",
  "hr-specialist",
  "developer",
  "executive",
];
const allowedBillingClaimStatuses: BillingClaimStatus[] = [
  "draft",
  "submitted",
  "approved",
  "rejected",
  "paid",
];
const allowedRiskLevels: RiskLevel[] = ["low", "medium", "high", "critical"];
const allowedComplianceActions: ComplianceAction[] = [
  "patient-record-access",
  "patient-data-export",
  "billing-review",
  "login",
  "failed-login",
  "permission-change",
];
/*
  Crea un resultado de validación.
*/
function createValidationResult(errors: string[]): ValidationResult {
  return {
    isValid: errors.length === 0,
    errors,
  };
}
/*
  Comprueba si un texto existe y no está vacío.
*/
function isRequiredText(value: string): boolean {
  return value.trim().length > 0;
}
/*
  Comprueba si un email tiene una estructura básica válida.
*/
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
/*
  Comprueba si una fecha en formato string es válida.
*/
function isValidDate(date: string): boolean {
  return !Number.isNaN(Date.parse(date));
}
/*
  Comprueba si una fecha está en el futuro.
*/
function isFutureDate(date: string): boolean {
  return new Date(date).getTime() > Date.now();
}
/*
  Valida una clínica de HealthCore.
*/
export function validateClinic(clinic: Clinic): ValidationResult {
  const errors: string[] = [];
  if (!isRequiredText(clinic.id)) {
    errors.push("Clinic id is required.");
  }
  if (!isRequiredText(clinic.name)) {
    errors.push("Clinic name is required.");
  }
  if (!isRequiredText(clinic.city)) {
    errors.push("Clinic city is required.");
  }
  if (!allowedCountries.includes(clinic.country)) {
    errors.push("Clinic country must be US or UK.");
  }
  if (!isRequiredText(clinic.address)) {
    errors.push("Clinic address is required.");
  }
  if (!isRequiredText(clinic.phone)) {
    errors.push("Clinic phone is required.");
  }
  return createValidationResult(errors);
}
/*
  Valida un paciente.
*/
export function validatePatient(patient: Patient): ValidationResult {
  const errors: string[] = [];
  if (!isRequiredText(patient.id)) {
    errors.push("Patient id is required.");
  }
  if (!isRequiredText(patient.firstName)) {
    errors.push("Patient first name is required.");
  }
  if (!isRequiredText(patient.lastName)) {
    errors.push("Patient last name is required.");
  }
  if (!isRequiredText(patient.email)) {
    errors.push("Patient email is required.");
  } else if (!isValidEmail(patient.email)) {
    errors.push("Patient email format is invalid.");
  }
  if (!isRequiredText(patient.phone)) {
    errors.push("Patient phone is required.");
  }
  if (!isRequiredText(patient.dateOfBirth)) {
    errors.push("Patient date of birth is required.");
  } else if (!isValidDate(patient.dateOfBirth)) {
    errors.push("Patient date of birth is invalid.");
  } else if (isFutureDate(patient.dateOfBirth)) {
    errors.push("Patient date of birth cannot be in the future.");
  }
  if (!allowedCountries.includes(patient.country)) {
    errors.push("Patient country must be US or UK.");
  }
  if (!isRequiredText(patient.assignedClinicId)) {
    errors.push("Patient must have an assigned clinic.");
  }
  return createValidationResult(errors);
}
/*
  Valida una cita médica.
*/
export function validateAppointment(
  appointment: Appointment
): ValidationResult {
  const errors: string[] = [];
  if (!isRequiredText(appointment.id)) {
    errors.push("Appointment id is required.");
  }
  if (!isRequiredText(appointment.patientId)) {
    errors.push("Appointment patient id is required.");
  }
  if (!isRequiredText(appointment.clinicId)) {
    errors.push("Appointment clinic id is required.");
  }
  if (!isRequiredText(appointment.staffId)) {
    errors.push("Appointment staff id is required.");
  }
  if (!isRequiredText(appointment.date)) {
    errors.push("Appointment date is required.");
  } else if (!isValidDate(appointment.date)) {
    errors.push("Appointment date is invalid.");
  }
  if (appointment.durationMinutes <= 0) {
    errors.push("Appointment duration must be greater than 0.");
  }
  if (!allowedAppointmentStatuses.includes(appointment.status)) {
    errors.push("Appointment status is not valid.");
  }
  if (!isRequiredText(appointment.reason)) {
    errors.push("Appointment reason is required.");
  }
  return createValidationResult(errors);
}
/*
  Valida un miembro del personal.
*/
export function validateStaffMember(
  staffMember: StaffMember
): ValidationResult {
  const errors: string[] = [];
  if (!isRequiredText(staffMember.id)) {
    errors.push("Staff member id is required.");
  }
  if (!isRequiredText(staffMember.firstName)) {
    errors.push("Staff member first name is required.");
  }
  if (!isRequiredText(staffMember.lastName)) {
    errors.push("Staff member last name is required.");
  }
  if (!isRequiredText(staffMember.email)) {
    errors.push("Staff member email is required.");
  } else if (!isValidEmail(staffMember.email)) {
    errors.push("Staff member email format is invalid.");
  }
  if (!allowedDepartments.includes(staffMember.department)) {
    errors.push("Staff member department is not valid.");
  }
  if (!allowedStaffRoles.includes(staffMember.role)) {
    errors.push("Staff member role is not valid.");
  }
  if (!isRequiredText(staffMember.clinicId)) {
    errors.push("Staff member clinic id is required.");
  }
  if (!allowedCountries.includes(staffMember.country)) {
    errors.push("Staff member country must be US or UK.");
  }
  return createValidationResult(errors);
}
/*
  Valida una reclamación de facturación.
*/
export function validateBillingClaim(
  claim: BillingClaim
): ValidationResult {
  const errors: string[] = [];
  if (!isRequiredText(claim.id)) {
    errors.push("Billing claim id is required.");
  }
  if (!isRequiredText(claim.patientId)) {
    errors.push("Billing claim patient id is required.");
  }
  if (!isRequiredText(claim.appointmentId)) {
    errors.push("Billing claim appointment id is required.");
  }
  if (!isRequiredText(claim.clinicId)) {
    errors.push("Billing claim clinic id is required.");
  }
  if (claim.amount <= 0) {
    errors.push("Billing claim amount must be greater than 0.");
  }
  if (claim.currency !== "USD" && claim.currency !== "GBP") {
    errors.push("Billing claim currency must be USD or GBP.");
  }
  if (!allowedBillingClaimStatuses.includes(claim.status)) {
    errors.push("Billing claim status is not valid.");
  }
  if (!isRequiredText(claim.submittedAt)) {
    errors.push("Billing claim submitted date is required.");
  } else if (!isValidDate(claim.submittedAt)) {
    errors.push("Billing claim submitted date is invalid.");
  }
  if (claim.status === "rejected" && !claim.rejectionReason) {
    errors.push("Rejected billing claims must include a rejection reason.");
  }
  return createValidationResult(errors);
}
/*
  Valida un registro de cumplimiento.
*/
export function validateComplianceLog(
  log: ComplianceLog
): ValidationResult {
  const errors: string[] = [];
  if (!isRequiredText(log.id)) {
    errors.push("Compliance log id is required.");
  }
  if (!isRequiredText(log.staffId)) {
    errors.push("Compliance log staff id is required.");
  }
  if (!allowedComplianceActions.includes(log.action)) {
    errors.push("Compliance action is not valid.");
  }
  if (!isRequiredText(log.timestamp)) {
    errors.push("Compliance timestamp is required.");
  } else if (!isValidDate(log.timestamp)) {
    errors.push("Compliance timestamp is invalid.");
  }
  if (!allowedCountries.includes(log.country)) {
    errors.push("Compliance country must be US or UK.");
  }
  if (!allowedRiskLevels.includes(log.riskLevel)) {
    errors.push("Compliance risk level is not valid.");
  }
  if (!isRequiredText(log.notes)) {
    errors.push("Compliance notes are required.");
  }
  return createValidationResult(errors);
}