const DEFAULT_BASE_URL = 'https://canvas.example.com';
const DEFAULT_ACCESS_TOKEN = 'sample-api-key-change-me';

const CANVAS_BASE_URL = process.env.REACT_APP_CANVAS_URL || DEFAULT_BASE_URL;
const CANVAS_ACCESS_TOKEN =
  process.env.REACT_APP_CANVAS_TOKEN || DEFAULT_ACCESS_TOKEN;

const DEFAULT_HEADERS = {
  Authorization: `Bearer ${CANVAS_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

function buildQuery(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, item));
    } else {
      search.append(key, value);
    }
  });

  return search.toString();
}

async function request(path, queryParams, init = {}) {
  const queryString = queryParams ? `?${buildQuery(queryParams)}` : '';
  const response = await fetch(`${CANVAS_BASE_URL}${path}${queryString}`, {
    ...init,
    headers: {
      ...DEFAULT_HEADERS,
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Canvas request failed: ${response.status} ${response.statusText} - ${errorBody}`,
    );
  }

  return response.json();
}

async function getCourse(courseId) {
  return request(`/api/v1/courses/${courseId}`);
}

async function getStudents(courseId, options = {}) {
  const data = await request(`/api/v1/courses/${courseId}/users`, {
    'enrollment_type[]': 'student',
    per_page: 100,
    ...options,
  });

  return data.map((student) => ({
    id: student.id,
    name: student.name,
    sortable_name: student.sortable_name,
    email: student.login_id || student.sis_user_id,
    raw: student,
  }));
}

async function getAssignments(courseId, options = {}) {
  return request(`/api/v1/courses/${courseId}/assignments`, {
    per_page: 100,
    ...options,
  });
}

async function getStudentSubmissions(courseId, studentId, options = {}) {
  return request(`/api/v1/courses/${courseId}/students/submissions`, {
    'student_ids[]': studentId,
    per_page: 100,
    ...options,
  });
}

const canvasAPI = {
  getCourse,
  getStudents,
  getAssignments,
  getStudentSubmissions,
};

export default canvasAPI;

