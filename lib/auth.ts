export type UserRole =
  | "club-leader"
  | "department-leader"
  | "class-leader"
  | "trainer"
  | "trainee"
  | "inventory-manager"
  | "member-manager"
  | "guest"

export interface AuthUser {
  id: string
  fullName: string
  email: string
  phone?: string
  role: UserRole
  status: "active" | "inactive" | "graduated"
  classId?: string
  departmentId?: string
  instrumentTypes?: string[]
  registeredEvents?: string[]
}

export interface AuthContext {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// Mock authentication - replace with real auth
export const mockUsers: Record<string, AuthUser> = {
  "admin@club.com": {
    id: "1",
    fullName: "Admin Leader",
    email: "admin@club.com",
    role: "club-leader",
    status: "active",
  },
  "dept@club.com": {
    id: "2",
    fullName: "Department Leader",
    email: "dept@club.com",
    role: "department-leader",
    status: "active",
    departmentId: "1",
  },
  "trainer@club.com": {
    id: "3",
    fullName: "John Trainer",
    email: "trainer@club.com",
    role: "trainer",
    status: "active",
    classId: "1",
    instrumentTypes: ["Piano", "Guitar"],
  },
  "trainee@club.com": {
    id: "4",
    fullName: "Jane Trainee",
    email: "trainee@club.com",
    role: "trainee",
    status: "active",
    classId: "1",
  },
  "inventory@club.com": {
    id: "5",
    fullName: "Inventory Manager",
    email: "inventory@club.com",
    role: "inventory-manager",
    status: "active",
  },
  "reports@club.com": {
    id: "6",
    fullName: "Reports Manager",
    email: "reports@club.com",
    role: "member-manager",
    status: "active",
  },
  "guest@club.com": {
    id: "7",
    fullName: "Guest User",
    email: "guest@club.com",
    role: "guest",
    status: "active",
    registeredEvents: [],
  },
}

export function hasPermission(user: AuthUser, action: string, resource?: string): boolean {
  const permissions: Record<UserRole, string[]> = {
    "club-leader": [
      "view-all",
      "manage-users",
      "manage-departments",
      "manage-classes",
      "manage-training",
      "manage-inventory",
      "manage-events",
      "view-reports",
      "manage-members",
    ],
    "department-leader": ["view-department", "manage-class-leaders", "manage-training", "view-class-reports"],
    "class-leader": ["manage-class", "manage-class-members", "schedule-sessions", "manage-training"],
    trainer: ["create-sessions", "upload-materials", "rate-trainees", "access-library"],
    trainee: ["view-schedule", "access-library", "submit-homework"],
    "inventory-manager": ["manage-instruments", "manage-clothing", "view-assignments"],
    "member-manager": ["generate-reports", "manage-member-status", "view-members"],
    guest: ["view-events", "view-club-info"],
  }

  return permissions[user.role]?.includes(action) ?? false
}
