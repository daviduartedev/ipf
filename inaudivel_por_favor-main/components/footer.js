fetch("/inaudivel_por_favor/components/footer.html")
  .then(response => {
    if (!response.ok) throw new Error("Footer não encontrado");
    return response.text();
  })
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  })
  .catch(error => console.error("Erro ao carregar footer:", error));
