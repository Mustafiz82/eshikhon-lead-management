// Stop words to ignore during similarity comparison
const STOP_WORDS = new Set([
  "course", "live", "training", "complete", "specialist", 
  "professional", "bootcamp", "masterclass", "for", "with", 
  "the", "and", "amp", "of", "in", "a", "an"
]);

function normalize(str) {
  if (!str) return [];
  return str
    .toLowerCase()
    .replace(/&amp;/gi, " ") // Clean HTML entities
    .replace(/\([^)]*\)/g, "") // Remove text inside brackets (Live Course)
    .replace(/[^\w\s]/g, " ") // Replace special symbols with spaces
    .split(/\s+/)
    .filter(word => word && !STOP_WORDS.has(word)); // Filter out stop words
}

function getSimilarity(input, courseName) {
  const inputWords = normalize(input);
  const courseWords = normalize(courseName);

  if (inputWords.length === 0 || courseWords.length === 0) return 0;

  // Count how many input words exist in the target course name
  const matched = courseWords.filter(word => inputWords.includes(word)).length;

  // Calculate coverage
  const inputCoverage = matched / inputWords.length;   // How much of input was found
  const courseCoverage = matched / courseWords.length; // How much of course title matched

  // 70% weight on input matching, 30% weight on course coverage
  return (inputCoverage * 0.7) + (courseCoverage * 0.3);
}

export function findBestCourse(input, courses = []) {
  if (!input) return null;

  const rawCourses = Array.isArray(courses) ? courses : courses.items || [];
  let best = null;
  let highest = 0;

  for (const course of rawCourses) {
    // 1. Exact or Code match check
    if (course.code && input.trim().toUpperCase() === course.code.toUpperCase()) {
      return course;
    }

    const score = getSimilarity(input, course.name);

    if (score > highest) {
      highest = score;
      best = course;
    }
  }

  return highest >= 0.45 ? best : null;
}