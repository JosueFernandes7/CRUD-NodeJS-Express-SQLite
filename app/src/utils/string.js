function formatCPF(cpf) {
  return cpf.replace(".", "").replace(".", "").replace("/", "").replace("-", "").trim()
}


export { formatCPF }