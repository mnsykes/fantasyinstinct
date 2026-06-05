
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

export { currencyFormatter, percentFormatter };