import "../test/index";

// swtich value
const select = document.getElementById("select") as HTMLSelectElement;
select.value = new URLSearchParams(location.search).get("log_level") ?? "";

select.addEventListener("change", () => {
  const { value } = select;
  const url = new URL(location.href);
  const urlSearch = url.searchParams;

  urlSearch.set("log_level", value);
  location.href = url.toString();
});
