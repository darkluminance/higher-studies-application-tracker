// API Endpoints - centralized path definitions

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/users/create",
  GET_USER: "/users/user/get",

  // Timeline/Dashboard
  TIMELINE: "/timeline/user/get",

  // Universities
  UNIVERSITIES: {
    LIST: "/university/user/get",
    CREATE: "/university/create",
    UPDATE: "/university/update",
    DELETE: "/university/delete",
  },

  // Applications
  APPLICATIONS: {
    LIST: "/applications/user/get",
    CREATE: "/applications/create",
    UPDATE: "/applications/update",
    DELETE: "/applications/delete",
  },

  // Faculties
  FACULTIES: {
    LIST: "/faculties/user/get",
    BY_UNIVERSITY: "/faculties/user/university/get",
    CREATE: "/faculties/create",
    UPDATE: "/faculties/update",
    DELETE: "/faculties/delete",
  },

  // Mails
  MAILS: {
    LIST: "/mails/user/get",
    CREATE: "/mails/create",
    UPDATE: "/mails/update",
    DELETE: "/mails/delete",
  },

  // Interviews
  INTERVIEWS: {
    LIST: "/interviews/user/get",
    BY_FACULTY: "/interviews/user/faculty/get",
    CREATE: "/interviews/create",
    UPDATE: "/interviews/update",
    DELETE: "/interviews/delete",
  },

  // Recommenders
  RECOMMENDERS: {
    LIST: "/recommenders/user/get",
    CREATE: "/recommenders/create",
    UPDATE: "/recommenders/update",
    DELETE: "/recommenders/delete",
  },
} as const;
