module.exports = {
  forbidden: [
    {
      name: "no-business-to-api",
      comment: "Business layer should not import from API layer",
      severity: "error",
      from: {
        path: "^src/business",
      },
      to: {
        path: "^src/routes",
      },
    },
    {
      name: "no-data-to-business",
      comment: "Data layer should not import from Business layer",
      severity: "error",
      from: {
        path: "^src/database",
      },
      to: {
        path: "^src/business",
      },
    },
    {
      name: "no-data-to-api",
      comment: "Data layer should not import from API layer",
      severity: "error",
      from: {
        path: "^src/database",
      },
      to: {
        path: "^src/routes",
      },
    },
    {
      name: "no-validation-to-business",
      comment: "Validation layer should not import from Business layer",
      severity: "error",
      from: {
        path: "^src/schemas",
      },
      to: {
        path: "^src/business",
      },
    },
    {
      name: "no-validation-to-data",
      comment: "Validation layer should not import from Data layer",
      severity: "error",
      from: {
        path: "^src/schemas",
      },
      to: {
        path: "^src/database",
      },
    },
    {
      name: "no-direct-prisma-access",
      comment: "Direct access to Prisma is forbidden; use repositories instead",
      severity: "error",
      from: {
        path: "^src/(business|routes)",
      },
      to: {
        path: "^src/database/prisma.ts",
      },
    },
    {
      name: "no-circular-dependencies",
      comment: "Modules should not depend on each other in a circular way",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",
      },
    },
  },
};
