/* ONE ERA — International Commerce
   Phase 4: country + currency foundation
*/
(function () {
  const STORAGE_KEY = "oneera_country";
  let config = null;

  async function loadConfig() {
    try {
      const response = await fetch("commerce.json");

      if (!response.ok) {
        throw new Error("commerce.json not found");
      }

      config = await response.json();
      return config;

    } catch (error) {
      console.error("ONE ERA Commerce:", error);
      return null;
    }
  }

  function getCountryByCode(code) {
    return config?.supported_countries?.find(
      country => country.code === code
    );
  }

  function getCountry() {
    const saved = localStorage.getItem(STORAGE_KEY);

    return getCountryByCode(saved)
      ? saved
      : (config?.default_country || "TH");
  }

  function setCountry(code) {
    if (!getCountryByCode(code)) return;

    localStorage.setItem(STORAGE_KEY, code);

    document.dispatchEvent(
      new CustomEvent("oneera:countrychange", {
        detail: getCountryByCode(code)
      })
    );

    updateUI();
  }

  function updateUI() {
    const country = getCountryByCode(getCountry());

    if (!country) return;

    document
      .querySelectorAll("[data-country-label]")
      .forEach(el => {
        el.textContent = `${country.flag} ${country.name}`;
      });

    document
      .querySelectorAll("[data-country-code]")
      .forEach(el => {
        el.textContent = country.code;
      });

    document
      .querySelectorAll("[data-currency-code]")
      .forEach(el => {
        el.textContent = country.currency;
      });

    document
      .querySelectorAll("[data-currency-symbol]")
      .forEach(el => {
        el.textContent = country.symbol;
      });

    document
      .querySelectorAll("[data-country-select]")
      .forEach(select => {
        select.value = country.code;
      });
  }

  function money(amount) {
    const country = getCountryByCode(getCountry());

    if (!country) return amount;

    try {
      return new Intl.NumberFormat(country.locale, {
        style: "currency",
        currency: country.currency,
        maximumFractionDigits:
          country.currency === "IDR" ? 0 : 2
      }).format(Number(amount) || 0);

    } catch {
      return `${country.symbol}${Number(amount || 0).toFixed(2)}`;
    }
  }

  window.ONEERA_COMMERCE = {
    loadConfig,
    getCountry,
    setCountry,
    money,
    getCountryByCode,

    get config() {
      return config;
    }
  };

  document.addEventListener(
    "DOMContentLoaded",
    async () => {

      await loadConfig();

      document
        .querySelectorAll("[data-country-select]")
        .forEach(select => {

          select.addEventListener(
            "change",
            event => {
              setCountry(event.target.value);
            }
          );

        });

      updateUI();

    }
  );

})();
