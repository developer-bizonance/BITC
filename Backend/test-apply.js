const testApply = async () => {
  const res = await fetch("http://localhost:5000/api/courses/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      courseId: "mern-stack",
      courseTitle: "MERN Stack Development",
      name: "Test User No Login",
      email: "nologin@example.com",
      phone: "9998887776"
    })
  });
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Data:", data);
};
testApply();
