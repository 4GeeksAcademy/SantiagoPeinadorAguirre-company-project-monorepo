//Este archivo contiene los modelos principales del negocio de HealthCore.
// Países donde opera HealthCore.
export type Country = "US" | "UK";
// Estados posibles de una cita médica.
export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no-show";
// Departamentos internos de HealthCore.
export type Department =
  | "clinical-operations"
  | "patient-experience"
  | "revenue-cycle"
  | "compliance"
  | "people-workforce"
  | "technology"
  | "executive";
// Roles generales del personal.
export type StaffRole =
  | "doctor"
  | "nurse"
  | "administrator"
  | "billing-specialist"
  | "compliance-officer"
  | "hr-specialist"
  | "developer"
  | "executive";
// Estados posibles de una reclamación de facturación.
export type BillingClaimStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "paid";
// Niveles de riesgo para cumplimiento y auditoría.
export type RiskLevel = "low" | "medium" | "high" | "critical";
// Acciones posibles en registros de cumplimiento.
export type ComplianceAction =
  | "patient-record-access"
  | "patient-data-export"
  | "billing-review"
  | "login"
  | "failed-login"
  | "permission-change";
//Interface que representa una clínica de HealthCore.
export interface Clinic {
  id: string;
  name: string;
  city: string;
  country: Country;
  address: string;
  phone: string;
  isActive: boolean;
}
//Interface que representa un paciente de HealthCore.
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  country: Country;
  assignedClinicId: string;
  hasChronicCondition: boolean;
}
//Interface que representa una cita médica de HealthCore.
export interface Appointment {
  id: string;
  patientId: string;
  clinicId: string;
  staffId: string;
  date: string;
  durationMinutes: number;
  status: AppointmentStatus;
  reason: string;
}
//Interface que representa un miembro del personal de HealthCore.
export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  role: StaffRole;
  clinicId: string;
  country: Country;
  isActive: boolean;
}
//Interface que representa una reclamación de facturación de HealthCore.
export interface BillingClaim {
  id: string;
  patientId: string;
  appointmentId: string;
  clinicId: string;
  amount: number;
  currency: "USD" | "GBP";
  status: BillingClaimStatus;
  submittedAt: string;
  rejectionReason?: string;
}
//Interface que representa un registro de cumplimiento o auditoría.
export interface ComplianceLog {
  id: string;
  staffId: string;
  patientId?: string;
  action: ComplianceAction;
  timestamp: string;
  country: Country;
  riskLevel: RiskLevel;
  notes: string;
}
//Interface que representa el resultado de una validación de datos.
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
//Interface que representa un reporte de conteo de elementos.
export interface CountReport {
  label: string;
  count: number;
}
//Interface que representa un reporte financiero.
export interface FinancialReport {
  label: string;
  totalAmount: number;
  currency: "USD" | "GBP";
}