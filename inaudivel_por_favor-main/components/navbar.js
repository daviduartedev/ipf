fetch("/inaudivel_por_favor/components/navbar.html")
  .then(response => {
    if (!response.ok) throw new Error("Navbar não encontrada");
    return response.text();
  })
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  })
  .catch(error => console.error("Erro ao carregar navbar:", error));
