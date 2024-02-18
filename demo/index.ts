import "../test/index";

// swtich value
const select = document.getElementById("select") as HTMLSelectElement;
select.value = new URLSearchParams(location.search).get("log") ?? "";

select.addEventListener("change", () => {
  const { value } = select;
  location.search = `?log=${value}`;
});
