const config = {
    baseApiUrl: "http://localhost:4000",
    FANTRAX_API_URL: "https://www.fantrax.com/fxea/general",
    FANTRAX_LEAGUE_ID: "er2bf6v3mhairboa"
}

const currencyFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
})

const percentFormatter = Intl.NumberFormat("en-US", {
    style: "percent",
    currency: "USD",
    maximumFractionDigits: 1
})

export default config;
export { currencyFormatter, percentFormatter };