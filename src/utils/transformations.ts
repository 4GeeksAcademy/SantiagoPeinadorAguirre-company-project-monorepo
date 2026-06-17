/*
  Este archivo contiene funciones de transformación y agregación de datos.
  En HealthCore, estas funciones sirven para convertir colecciones grandes
  de datos en información útil para el negocio.
*/
import type {
  Appointment,
  BillingClaim,
  BillingClaimStatus,
  CountReport,
  FinancialReport,
  Patient,
  StaffMember,
} from "../types/models";
/*
  Cuenta pacientes por país.
*/
export function countPatientsByCountry(patients: Patient[]): CountReport[] {
  const result = patients.reduce((accumulator, patient) => {
    const country = patient.country;
    accumulator[country] = (accumulator[country] || 0) + 1;
    return accumulator;
  }, {} as Record<string, number>);

  return Object.entries(result).map(([label, count]) => ({
    label,
    count,
  }));
}
/*
  Cuenta citas por clínica.
*/
export function countAppointmentsByClinic(
  appointments: Appointment[]
): CountReport[] {
  const result = appointments.reduce((accumulator, appointment) => {
    const clinicId = appointment.clinicId;
    accumulator[clinicId] = (accumulator[clinicId] || 0) + 1;
    return accumulator;
  }, {} as Record<string, number>);
  return Object.entries(result).map(([label, count]) => ({
    label,
    count,
  }));
}
/*
  Cuenta citas por estado.
*/
export function countAppointmentsByStatus(
  appointments: Appointment[]
): CountReport[] {
  const result = appointments.reduce((accumulator, appointment) => {
    const status = appointment.status;
    accumulator[status] = (accumulator[status] || 0) + 1;
    return accumulator;
  }, {} as Record<string, number>);
  return Object.entries(result).map(([label, count]) => ({
    label,
    count,
  }));
}
/*
  Calcula la tasa de no-shows.
  Devuelve un número en porcentaje.
*/
export function calculateNoShowRate(appointments: Appointment[]): number {
  if (appointments.length === 0) {
    return 0;
  }
  const noShowAppointments = appointments.filter(
    (appointment) => appointment.status === "no-show"
  );
  const rate = (noShowAppointments.length / appointments.length) * 100;
  return Number(rate.toFixed(2));
}
/*
  Cuenta miembros del personal por departamento.
*/
export function countStaffByDepartment(
  staffMembers: StaffMember[]
): CountReport[] {
  const result = staffMembers.reduce((accumulator, staffMember) => {
    const department = staffMember.department;
    accumulator[department] = (accumulator[department] || 0) + 1;
    return accumulator;
  }, {} as Record<string, number>);
  return Object.entries(result).map(([label, count]) => ({
    label,
    count,
  }));
}
/*
  Cuenta reclamaciones de facturación por estado.
*/
export function countBillingClaimsByStatus(
  claims: BillingClaim[]
): CountReport[] {
  const result = claims.reduce((accumulator, claim) => {
    const status = claim.status;
    accumulator[status] = (accumulator[status] || 0) + 1;
    return accumulator;
  }, {} as Record<string, number>);
  return Object.entries(result).map(([label, count]) => ({
    label,
    count,
  }));
}
/*
  Cuenta reclamaciones de facturación de un estado concreto.
*/
export function countClaimsBySpecificStatus(
  claims: BillingClaim[],
  status: BillingClaimStatus
): number {
  return claims.filter((claim) => claim.status === status).length;
}
/*
  Suma importes de reclamaciones por moneda.
*/
export function sumBillingAmountByCurrency(
  claims: BillingClaim[],
  currency: "USD" | "GBP"
): number {
  const total = claims
    .filter((claim) => claim.currency === currency)
    .reduce((sum, claim) => sum + claim.amount, 0);
  return Number(total.toFixed(2));
}
/*
  Genera un reporte financiero por moneda.
  Devuelve un array con el total acumulado para USD y GBP,
*/
export function createFinancialReportByCurrency(
  claims: BillingClaim[]
): FinancialReport[] {
  const result = claims.reduce((accumulator, claim) => {
    const currency = claim.currency;
    accumulator[currency] = (accumulator[currency] || 0) + claim.amount;
    return accumulator;
  }, {} as Record<"USD" | "GBP", number>);
  return Object.entries(result).map(([currency, totalAmount]) => ({
    label: `Total billing amount in ${currency}`,
    totalAmount: Number(totalAmount.toFixed(2)),
    currency: currency as "USD" | "GBP",
  }));
}
/*
  Calcula el promedio de importe de las reclamaciones.
  Si no hay reclamaciones, devuelve 0 para evitar dividir entre cero.
*/
export function calculateAverageClaimAmount(claims: BillingClaim[]): number {
  if (claims.length === 0) {
    return 0;
  }
  const total = claims.reduce((sum, claim) => sum + claim.amount, 0);
  const average = total / claims.length;
  return Number(average.toFixed(2));
}
/*
  Encuentra la reclamación con mayor importe.
  Devuelve:
  - la reclamación más alta
  - undefined si el array está vacío
*/
export function findHighestClaim(
  claims: BillingClaim[]
): BillingClaim | undefined {
  if (claims.length === 0) {
    return undefined;
  }
  return claims.reduce((highestClaim, currentClaim) => {
    return currentClaim.amount > highestClaim.amount
      ? currentClaim
      : highestClaim;
  });
}
/*
  Encuentra la reclamación con menor importe.
  Devuelve:
  - la reclamación más baja
  - undefined si el array está vacío
*/
export function findLowestClaim(
  claims: BillingClaim[]
): BillingClaim | undefined {
  if (claims.length === 0) {
    return undefined;
  }
  return claims.reduce((lowestClaim, currentClaim) => {
    return currentClaim.amount < lowestClaim.amount
      ? currentClaim
      : lowestClaim;
  });
}