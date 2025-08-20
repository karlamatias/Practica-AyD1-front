export const UserRoleId = {
    ADMIN: 1,
    EMPLOYEE: 2,
    SPECIALIST: 3,
    CUSTOMER: 4,
    SUPPLIER: 5,
} as const;

export type UserRoleId = (typeof UserRoleId)[keyof typeof UserRoleId];

// rutas según id
export const roleRoutes: Record<UserRoleId, string> = {
    [UserRoleId.ADMIN]: "/dashboard/admin",
    [UserRoleId.EMPLOYEE]: "/dashboard/employee",
    [UserRoleId.SPECIALIST]: "/dashboard/specialist",
    [UserRoleId.CUSTOMER]: "/dashboard/customer",
    [UserRoleId.SUPPLIER]: "/dashboard/supplier",
};
