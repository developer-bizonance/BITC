async function check() {
  try {
    const res = await fetch("http://localhost:3000/courses/human-resource");
    const text = await res.text();
    console.log("Frontend has Human resource:", text.includes("Human resource"));
    console.log("Frontend has Human Resource:", text.includes("Human Resource"));
  } catch (e) {
    console.error("Frontend check failed:", e);
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/api/courses/human-resource");
    const json = await res.json();
    console.log("Backend response:", json.course.title);
  } catch (e) {
    console.error("Backend check failed:", e);
  }
}
check();
