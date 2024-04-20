import { LogFilterKey } from "../src/index";
import "../test/index";

// swtich value
const select = document.getElementById("select") as HTMLSelectElement;
select.value = new URLSearchParams(location.search).get(LogFilterKey.level) ?? "";

select.addEventListener("change", () => {
  const { value } = select;
  const url = new URL(location.href);
  const urlSearch = url.searchParams;

  urlSearch.set(LogFilterKey.level, value);
  location.href = url.toString();
});
