<!DOCTYPE html>
<html>
<head>
  <title>RP CAD Login</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="login-box">
    <h2>RP CAD / MDT</h2>
    <input id="user" placeholder="Badge / Username">
    <button onclick="login()">Login</button>
  </div>

<script>
function login() {
  localStorage.setItem("officer", document.getElementById("user").value);
  window.location.href = "dashboard.html";
}
</script>
</body>
</html>
