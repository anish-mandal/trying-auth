let form = document.getElementsByTagName("form");

form[0].addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: e.target.email.value,
    password: e.target.password.value,
  };

  if (data.email === "" && data.password === "") {
    return;
  }

  let response = await fetch("/api/adduser", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  let toast = new Toast();
  await response.text().then((d) => {
    toast.success(JSON.parse(d).message);
  });
});
