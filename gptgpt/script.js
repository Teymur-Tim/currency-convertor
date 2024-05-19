document.addEventListener("DOMContentLoaded", () => {
  const fromButtons = document.querySelectorAll(
    "#from-currency-buttons .merged-button"
  );
  const toButtons = document.querySelectorAll(
    "#to-currency-buttons .merged-button"
  );
  const amountInput = document.getElementById("amount");
  const convertedAmountInput = document.getElementById("converted-amount");
  const fromRateDiv = document.getElementById("from-rate");
  const toRateDiv = document.getElementById("to-rate");
  const statusDiv = document.getElementById("status");

  let fromCurrency = "USD";
  let toCurrency = "RUB";

  fromButtons.forEach((button) => {
    button.addEventListener("click", () => {
      fromCurrency = button.getAttribute("data-currency");
      setActiveButton(fromButtons, button);
      updateConversion();
    });
  });

  toButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toCurrency = button.getAttribute("data-currency");
      setActiveButton(toButtons, button);
      updateConversion();
    });
  });

  amountInput.addEventListener("input", () => {
    amountInput.value = amountInput.value.replace(/[^0-9.]/g, "");
    updateConversion();
  });

  async function fetchRate(from, to) {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${from}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.rates[to];
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return null;
    }
  }

  async function updateConversion() {
    const amount = parseFloat(amountInput.value) || 0;
    const rate = await fetchRate(fromCurrency, toCurrency);
    if (rate) {
      statusDiv.innerText = "";
      const convertedAmount = (amount * rate).toFixed(4);
      convertedAmountInput.value = convertedAmount;

      const formattedRate = rate.toFixed(4);
      const reverseRate = (1 / rate).toFixed(4);
      fromRateDiv.innerText = `1 ${fromCurrency} = ${formattedRate} ${toCurrency}`;
      toRateDiv.innerText = `1 ${toCurrency} = ${reverseRate} ${fromCurrency}`;
    } else {
      statusDiv.innerText = "Network error. Please try again later.";
    }
  }

  function setActiveButton(buttons, activeButton) {
    buttons.forEach((button) => {
      button.classList.remove("active");
    });
    activeButton.classList.add("active");
  }

  window.addEventListener("offline", function () {
    statusDiv.innerText =
      "internet paketiniz bitib yeni paket goturmek ucun *306*2# yes";
  });

  window.addEventListener("online", function () {
    statusDiv.innerText = "";
    updateConversion();
  });

  updateConversion();
});
