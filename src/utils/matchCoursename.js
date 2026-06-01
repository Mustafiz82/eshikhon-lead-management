function normalize(str) {
  return str
    .toLowerCase()
    .replace(/\([^)]*\)/g, "") // remove (Live Course)
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function getSimilarity(input, courseName) {
  const inputWords = normalize(input);
  const courseWords = normalize(courseName);

  const matched = courseWords.filter(word =>
    inputWords.includes(word)
  ).length;

  return matched / Math.max(inputWords.length, courseWords.length);
}

export function findBestCourse(input, courses) {
  let best = null;
  let highest = 0;

  for (const course of courses) {
    const score = getSimilarity(input, course.name);

    if (score > highest) {
      highest = score;
      best = course;
    }
  }

  return highest >= 0.5 ? best : null;
}