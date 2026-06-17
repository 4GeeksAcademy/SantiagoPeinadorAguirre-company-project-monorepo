/*
  Archivo de demostración del Hito 2.
  Aquí creamos objetos ficticios de HealthCore y usamos las funcionesque hemos construido en los archivos de utils.
*/
import type {
  Appointment,
  BillingClaim,
  Clinic,
  ComplianceLog,
  Patient,
  StaffMember,
} from "./types/models";
import {
  filterItems,
  getFirstItem,
  getLastItem,
  groupByProperty,
  isEmptyCollection,
  sortByProperty,
} from "./utils/collections";
import {
  binarySearch,
  binarySearchIndex,
  linearSearch,
  linearSearchIndex,
} from "./utils/search";
import {
  calculateAverageClaimAmount,
  calculateNoShowRate,
  countAppointmentsByClinic,
  countAppointmentsByStatus,
  countBillingClaimsByStatus,
  countClaimsBySpecificStatus,
  countPatientsByCountry,
  countStaffByDepartment,
  createFinancialReportByCurrency,
  findHighestClaim,
  findLowestClaim,
  sumBillingAmountByCurrency,
} from "./utils/transformations";
import {
  validateAppointment,
  validateBillingClaim,
  validateClinic,
  validateComplianceLog,
  validatePatient,
  validateStaffMember,
} from "./utils/validations";
/*
  Clínicas ficticias de HealthCore. Representan sedes en Estados Unidos y Reino Unido.
*/
const clinics: Clinic[] = [
  {
    id: "CL-001",
    name: "HealthCore Austin Central",
    city: "Austin",
    country: "US",
    address: "1200 Wellness Ave, Austin, TX",
    phone: "+1-512-555-0101",
    isActive: true,
  },
  {
    id: "CL-002",
    name: "HealthCore Miami Beach",
    city: "Miami",
    country: "US",
    address: "88 Ocean Health Blvd, Miami, FL",
    phone: "+1-305-555-0145",
    isActive: true,
  },
  {
    id: "CL-003",
    name: "HealthCore London City",
    city: "London",
    country: "UK",
    address: "22 Patient Lane, London",
    phone: "+44-20-5555-0110",
    isActive: true,
  },
];
/*
  Pacientes ficticios. Cada paciente está asociado a una clínica mediante assignedClinicId.
*/
const patients: Patient[] = [
  {
    id: "PAT-001",
    firstName: "Ana",
    lastName: "Martínez",
    email: "ana.martinez@example.com",
    phone: "+1-512-555-1001",
    dateOfBirth: "1988-04-12",
    country: "US",
    assignedClinicId: "CL-001",
    hasChronicCondition: true,
  },
  {
    id: "PAT-002",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@example.com",
    phone: "+1-305-555-1002",
    dateOfBirth: "1975-09-30",
    country: "US",
    assignedClinicId: "CL-002",
    hasChronicCondition: false,
  },
  {
    id: "PAT-003",
    firstName: "Priya",
    lastName: "Shah",
    email: "priya.shah@example.com",
    phone: "+44-20-5555-1003",
    dateOfBirth: "1992-01-18",
    country: "UK",
    assignedClinicId: "CL-003",
    hasChronicCondition: false,
  },
];
/*
  Personal ficticio de HealthCore. Incluye perfiles clínicos, facturación, cumplimiento y tecnología.
*/
const staffMembers: StaffMember[] = [
  {
    id: "STAFF-001",
    firstName: "Marcus",
    lastName: "Reid",
    email: "marcus.reid@healthcore.com",
    department: "clinical-operations",
    role: "doctor",
    clinicId: "CL-001",
    country: "US",
    isActive: true,
  },
  {
    id: "STAFF-002",
    firstName: "Tom",
    lastName: "Callahan",
    email: "tom.callahan@healthcore.com",
    department: "revenue-cycle",
    role: "billing-specialist",
    clinicId: "CL-002",
    country: "US",
    isActive: true,
  },
  {
    id: "STAFF-003",
    firstName: "Claire",
    lastName: "Whitfield",
    email: "claire.whitfield@healthcore.com",
    department: "compliance",
    role: "compliance-officer",
    clinicId: "CL-003",
    country: "UK",
    isActive: true,
  },
  {
    id: "STAFF-004",
    firstName: "James",
    lastName: "Osei",
    email: "james.osei@healthcore.com",
    department: "technology",
    role: "developer",
    clinicId: "CL-001",
    country: "US",
    isActive: true,
  },
];
/*
  Citas médicas ficticias.
*/
const appointments: Appointment[] = [
  {
    id: "APT-001",
    patientId: "PAT-001",
    clinicId: "CL-001",
    staffId: "STAFF-001",
    date: "2026-06-20T10:00:00",
    durationMinutes: 30,
    status: "completed",
    reason: "Annual checkup",
  },
  {
    id: "APT-002",
    patientId: "PAT-002",
    clinicId: "CL-002",
    staffId: "STAFF-001",
    date: "2026-06-21T12:00:00",
    durationMinutes: 45,
    status: "no-show",
    reason: "Chronic condition follow-up",
  },
  {
    id: "APT-003",
    patientId: "PAT-003",
    clinicId: "CL-003",
    staffId: "STAFF-003",
    date: "2026-06-22T09:30:00",
    durationMinutes: 30,
    status: "scheduled",
    reason: "Primary care consultation",
  },
  {
    id: "APT-004",
    patientId: "PAT-001",
    clinicId: "CL-001",
    staffId: "STAFF-001",
    date: "2026-06-23T15:00:00",
    durationMinutes: 30,
    status: "cancelled",
    reason: "Preventive health consultation",
  },
];
/*
  Reclamaciones de facturación ficticias.
*/
const billingClaims: BillingClaim[] = [
  {
    id: "BILL-001",
    patientId: "PAT-001",
    appointmentId: "APT-001",
    clinicId: "CL-001",
    amount: 180,
    currency: "USD",
    status: "paid",
    submittedAt: "2026-06-20",
  },
  {
    id: "BILL-002",
    patientId: "PAT-002",
    appointmentId: "APT-002",
    clinicId: "CL-002",
    amount: 240,
    currency: "USD",
    status: "rejected",
    submittedAt: "2026-06-21",
    rejectionReason: "Missing insurance authorization",
  },
  {
    id: "BILL-003",
    patientId: "PAT-003",
    appointmentId: "APT-003",
    clinicId: "CL-003",
    amount: 150,
    currency: "GBP",
    status: "submitted",
    submittedAt: "2026-06-22",
  },
];
/*
  Registros ficticios de cumplimiento.
*/
const complianceLogs: ComplianceLog[] = [
  {
    id: "LOG-001",
    staffId: "STAFF-003",
    patientId: "PAT-003",
    action: "patient-record-access",
    timestamp: "2026-06-22T08:45:00",
    country: "UK",
    riskLevel: "low",
    notes: "Routine patient record access for scheduled appointment.",
  },
  {
    id: "LOG-002",
    staffId: "STAFF-004",
    action: "failed-login",
    timestamp: "2026-06-22T18:10:00",
    country: "US",
    riskLevel: "medium",
    notes: "Failed login detected from internal system.",
  },
];
/*
  Objeto con errores intencionales.
  Lo usamos para comprobar que las validaciones detectan fallos.
*/
const invalidPatient: Patient = {
  id: "",
  firstName: "",
  lastName: "Test",
  email: "invalid-email",
  phone: "",
  dateOfBirth: "2035-01-01",
  country: "US",
  assignedClinicId: "",
  hasChronicCondition: false,
};
/*
  Separador visual para que la consola sea más fácil de leer.
*/
function printSection(title: string): void {
  console.log("\n====================================");
  console.log(title);
  console.log("====================================");
}
/*
  1. Pruebas de colecciones.
*/
printSection("COLLECTIONS");
const usPatients = filterItems(
  patients,
  (patient) => patient.country === "US"
);
console.log("US patients:", usPatients);
const patientsSortedByLastName = sortByProperty(
  patients,
  "lastName",
  "asc"
);
console.log("Patients sorted by last name:", patientsSortedByLastName);
const appointmentsGroupedByStatus = groupByProperty(
  appointments,
  "status"
);
console.log("Appointments grouped by status:", appointmentsGroupedByStatus);
console.log("First patient:", getFirstItem(patients));
console.log("Last patient:", getLastItem(patients));
console.log("Is patients collection empty?", isEmptyCollection(patients));
/*
  2. Pruebas de búsqueda lineal.
*/
printSection("LINEAR SEARCH");
const patientFoundByLinearSearch = linearSearch(
  patients,
  (patient) => patient.id === "PAT-002"
);
console.log("Patient found with linear search:", patientFoundByLinearSearch);
const appointmentIndex = linearSearchIndex(
  appointments,
  (appointment) => appointment.id === "APT-003"
);
console.log("Appointment index with linear search:", appointmentIndex);
/*
  3. Pruebas de búsqueda binaria.
*/
printSection("BINARY SEARCH");
const patientsSortedById = sortByProperty(patients, "id", "asc");
const patientFoundByBinarySearch = binarySearch(
  patientsSortedById,
  (patient) => patient.id,
  "PAT-003"
);
console.log("Patient found with binary search:", patientFoundByBinarySearch);
const patientBinaryIndex = binarySearchIndex(
  patientsSortedById,
  (patient) => patient.id,
  "PAT-003"
);
console.log("Patient index with binary search:", patientBinaryIndex);
/*
  4. Pruebas de transformaciones y reportes.
*/
printSection("TRANSFORMATIONS AND REPORTS");
console.log("Patients by country:", countPatientsByCountry(patients));
console.log(
  "Appointments by clinic:",
  countAppointmentsByClinic(appointments)
);
console.log(
  "Appointments by status:",
  countAppointmentsByStatus(appointments)
);
console.log(
  "No-show rate:",
  `${calculateNoShowRate(appointments)}%`
);
console.log(
  "Staff by department:",
  countStaffByDepartment(staffMembers)
);
console.log(
  "Billing claims by status:",
  countBillingClaimsByStatus(billingClaims)
);
console.log(
  "Rejected claims:",
  countClaimsBySpecificStatus(billingClaims, "rejected")
);
console.log(
  "Total USD billing amount:",
  sumBillingAmountByCurrency(billingClaims, "USD")
);
console.log(
  "Total GBP billing amount:",
  sumBillingAmountByCurrency(billingClaims, "GBP")
);
console.log(
  "Financial report by currency:",
  createFinancialReportByCurrency(billingClaims)
);
console.log(
  "Average claim amount:",
  calculateAverageClaimAmount(billingClaims)
);
console.log("Highest claim:", findHighestClaim(billingClaims));
console.log("Lowest claim:", findLowestClaim(billingClaims));
/*
  5. Pruebas de validaciones.
*/
printSection("VALIDATIONS");
console.log("Validate clinic:", validateClinic(clinics[0]));
console.log("Validate patient:", validatePatient(patients[0]));
console.log("Validate invalid patient:", validatePatient(invalidPatient));
console.log(
  "Validate appointment:",
  validateAppointment(appointments[0])
);
console.log(
  "Validate staff member:",
  validateStaffMember(staffMembers[0])
);
console.log(
  "Validate billing claim:",
  validateBillingClaim(billingClaims[0])
);
console.log(
  "Validate compliance log:",
  validateComplianceLog(complianceLogs[0])
);